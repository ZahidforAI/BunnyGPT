import unittest
from unittest.mock import AsyncMock, patch

from backend.app import (
    BUNNYHOOD_KNOWLEDGE,
    CitationStreamFilter,
    PlainTextStreamFilter,
    ResponseStyleStreamFilter,
    WebSource,
    build_system_prompt,
    classify_source_mode,
    collect_live_sources,
    current_price_answer,
    is_identity_question,
    research_fallback,
    unusable_model_answer,
)


class BunnyGPTAsyncBackendTests(unittest.IsolatedAsyncioTestCase):
    async def test_finance_source_survives_search_outage(self):
        price_source = WebSource(
            title="CoinGecko current Ethereum price",
            url="https://www.coingecko.com/en/coins/ethereum",
            snippet="Verified current market snapshot: Ethereum is $2,400 USD.",
        )
        with (
            patch(
                "backend.app.search_you",
                new=AsyncMock(side_effect=RuntimeError("search unavailable")),
            ),
            patch(
                "backend.app.current_crypto_prices",
                new=AsyncMock(return_value=[price_source]),
            ),
        ):
            sources = await collect_live_sources("price of ethereum?")

        self.assertEqual(sources, [price_source])


class BunnyGPTBackendTests(unittest.TestCase):
    def test_source_routing(self):
        self.assertEqual(classify_source_mode("What is BunnyHood?"), "hybrid")
        self.assertEqual(classify_source_mode("What is the BTC price right now?"), "live")
        self.assertEqual(classify_source_mode("Why is the sky blue?"), "live")
        self.assertEqual(
            classify_source_mode("What is the latest BunnyHood news?"), "hybrid"
        )

    def test_loads_official_knowledge(self):
        self.assertIn("public BunnyHood collection has not minted", BUNNYHOOD_KNOWLEDGE)
        self.assertIn("Never invent an explanation", BUNNYHOOD_KNOWLEDGE)

    def test_prompt_excludes_reasoning_and_markdown(self):
        prompt = build_system_prompt("quant", "official", [])
        self.assertIn("Never use Markdown", prompt)
        self.assertIn("Do not reveal hidden reasoning", prompt)
        self.assertIn("permanent public identity is Quant", prompt)
        self.assertIn("Never say you are a generic assistant", prompt)
        self.assertIn("Phase III is Controlled Autonomy", prompt)
        self.assertIn("Phase IV is the Agent Economy", prompt)
        self.assertIn("Hood assessment:", prompt)
        self.assertIn("Never invent or imply a citation in official mode", prompt)

    def test_live_capability_uses_supplied_finance_data(self):
        source = WebSource(
            title="CoinGecko current Ethereum price",
            url="https://www.coingecko.com/en/coins/ethereum",
            snippet=(
                "Verified current market snapshot: Ethereum is $2,400 USD as of "
                "September 02, 2026 at 12:00:00 UTC. The 24 hour change is down 2.00%."
            ),
        )
        answer = current_price_answer("quant", [source])
        self.assertIn("Ethereum is $2,400 USD", answer)
        self.assertIn("Hood assessment:", answer)
        self.assertNotIn("cannot", answer.casefold())

    def test_research_fallback_replaces_denials_and_short_answers(self):
        source = WebSource(
            title="Current market report",
            url="https://example.com/report",
            snippet="A current sourced finding with enough detail for the user.",
        )
        answer = research_fallback("trader", [source])
        self.assertIn("Current read:", answer)
        self.assertIn("[1]", answer)
        self.assertTrue(unusable_model_answer("Coin"))
        self.assertTrue(unusable_model_answer("I cannot browse for that information."))

    def test_protects_bunnygpt_identity(self):
        self.assertTrue(is_identity_question("Who are you?"))
        self.assertTrue(is_identity_question("Which model are you using?"))
        self.assertTrue(is_identity_question("Are you Nemotron?"))
        self.assertFalse(is_identity_question("What is BunnyHood?"))

    def test_stream_filter_removes_markdown_markers(self):
        stream_filter = PlainTextStreamFilter()
        result = stream_filter.feed("**Assessment:**\n- Clear answer\nNormal hyphen-used")
        self.assertEqual(result, "Assessment:\nClear answer\nNormal hyphen used")

    def test_style_filter_rewrites_apostrophes_across_chunks(self):
        style_filter = ResponseStyleStreamFilter()
        result = (
            style_filter.feed("Ethereum")
            + style_filter.feed("'s role means I'm ready")
            + style_filter.flush()
        )
        self.assertEqual(result, "Ethereum role means I am ready")

    def test_official_mode_citation_filter_handles_split_chunks(self):
        citation_filter = CitationStreamFilter(suppress=True)
        result = citation_filter.feed("Blue sky [") + citation_filter.feed("1] explained")
        self.assertEqual(result, "Blue sky  explained")


if __name__ == "__main__":
    unittest.main()
