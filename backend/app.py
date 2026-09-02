"""Compatibility alias for tests and local imports."""

import sys

from frontend.api import core

sys.modules[__name__] = core
