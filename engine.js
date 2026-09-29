/* BatMath engine - baseball stat math: AVG/OBP/SLG/OPS, BABIP, ERA/WHIP, the innings-thirds quirk.
   Pure math, no DOM. Shared by app.html and the node test suite. */
(function (root) {
  'use strict';

  function safe(n) { return (typeof n === 'number' && isFinite(n)) ? n : null; }

  // Baseball writes innings as innings.outs: 6.1 is six and a THIRD (1 out), not 6.1 decimal.
  // outsFromIp(innings, outs) -> total outs; ipFromOuts back to innings float.
  function outsFromIp(innings, outs) {
    if (!(innings >= 0) || !(outs >= 0)) return null;
    if (outs > 2) return null; // an inning has 3 outs
    return innings * 3 + outs;
  }
  function ipFromOuts(outs) {
    if (!(outs >= 0)) return null;
    return Math.floor(outs / 3) + (outs % 3) / 10; // baseball notation
  }
  function ipDecimal(innings, outs) {
    var o = outsFromIp(innings, outs);
    return o === null ? null : o / 3;
  }

  function avg(h, ab) { return ab > 0 ? safe(h / ab) : null; }
  function obp(h, bb, hbp, ab, sf) {
    var den = ab + bb + hbp + sf;
    return den > 0 ? safe((h + bb + hbp) / den) : null;
  }
  // Total bases from the hit mix; singles are whatever hits remain.
  function totalBases(h, doubles, triples, hr) {
    var singles = h - doubles - triples - hr;
    if (singles < 0) return null;
    return singles + 2 * doubles + 3 * triples + 4 * hr;
  }
  function slg(tb, ab) { return ab > 0 ? safe(tb / ab) : null; }
  function ops(obpVal, slgVal) {
    if (obpVal === null || slgVal === null) return null;
    return safe(obpVal + slgVal);
  }
  function iso(slgVal, avgVal) {
    if (slgVal === null || avgVal === null) return null;
    return safe(slgVal - avgVal);
  }
  // BABIP: how often a ball in play becomes a hit. Luck and defense live here.
  function babip(h, hr, ab, k, sf) {
    var den = ab - hr - k + sf;
    return den > 0 ? safe((h - hr) / den) : null;
  }

  function era(er, ipDec) { return ipDec > 0 ? safe(9 * er / ipDec) : null; }
  function whip(bb, h, ipDec) { return ipDec > 0 ? safe((bb + h) / ipDec) : null; }
  function per9(count, ipDec) { return ipDec > 0 ? safe(count * 9 / ipDec) : null; }

  // Baseball stat display: .300, not 0.300.
  function fmtAvg(x) {
    if (x === null || !isFinite(x)) return '-';
    var s = x.toFixed(3);
    return x < 1 ? s.slice(1) : s;
  }
  function fmtEra(x) {
    if (x === null || !isFinite(x)) return '-';
    return x.toFixed(2);
  }

  // Honest OPS bands (modern MLB).
  function opsBand(o) {
    if (!(o > 0)) return null;
    if (o < 0.600) return 'overmatched - the pitcher is ahead before the windup';
    if (o < 0.670) return 'below average - a bat the lineup hides';
    if (o < 0.730) return 'league average - a real job';
    if (o < 0.800) return 'above average - middle-of-order candidate';
    if (o < 0.900) return 'all-star bat';
    return 'MVP shape - the whole lineup bends around this';
  }

  // Honest ERA bands.
  function eraBand(e) {
    if (!(e >= 0)) return null;
    if (e < 2.50) return 'ace - Cy Young ballots know this number';
    if (e < 3.25) return 'strong number two';
    if (e < 4.00) return 'solid mid-rotation';
    if (e < 4.75) return 'back-end starter - innings, not dominance';
    if (e < 5.75) return 'trouble - every start is an adventure';
    return 'bullpen cart warming up';
  }

  var api = {
    outsFromIp: outsFromIp,
    ipFromOuts: ipFromOuts,
    ipDecimal: ipDecimal,
    avg: avg,
    obp: obp,
    totalBases: totalBases,
    slg: slg,
    ops: ops,
    iso: iso,
    babip: babip,
    era: era,
    whip: whip,
    per9: per9,
    fmtAvg: fmtAvg,
    fmtEra: fmtEra,
    opsBand: opsBand,
    eraBand: eraBand
  };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  root.BatMath = api;
})(typeof window !== 'undefined' ? window : globalThis);
