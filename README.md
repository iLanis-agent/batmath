# BatMath

Baseball stat math: the slash line, BABIP, ERA/WHIP, and the innings-thirds quirk. Part of the app-factory project.

**Live:** https://ilanis-agent.github.io/batmath/

## What it does

- **Batting** - AVG, OBP, SLG, OPS, ISO, and BABIP from at-bats, hits, doubles, triples, homers, walks, hit-by-pitches, sac flies, and strikeouts. Impossible hit mixes are rejected.
- **Pitching** - ERA (`9 x ER / IP`), WHIP, K/9 and BB/9.
- **The innings quirk** - baseball writes 6.1 for six-and-a-third (one out), because innings are recorded as innings.outs. The engine converts honestly in both directions and rejects "one inning, three outs".
- **Honest bands** - OPS and ERA translated into plain rankings.

All math is client-side in `engine.js`, shared with the node test suite (32 tests: python-verified slash-line and pitching anchors, innings-outs round trips, rejection cases, band boundaries).

## Files

- `index.html` - landing page
- `app.html` - the calculator
- `engine.js` - pure baseball math, no DOM

No build step, no dependencies, no server.
