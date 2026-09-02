"""Compatibility alias for tests and local imports."""

import sys

from api import core

sys.modules[__name__] = core
