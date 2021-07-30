/*
fastq-join.coffee
(Based on Fastq-join 1.01 by Expression Analysis / Erik Aronesty)

Copyright (c) 2015 Jeongbin Park

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
 */
importScripts("./pako.js");

const post = (msgType, msg) => postMessage({ msgType, msg });
const pgcallback = p => post(2, p);

function needle(a, b, gapopen, gapextend, endgapopen, endgapextend) {
  function E_FPEQ(a, b, e) {
    return b - e < a && a < b + e;
  }

  const sub = [
    [5, -4, -4, -4, -4, 1, 1, -4, -4, 1, -4, -1, -1, -1, -2, -4],
    [-4, 5, -4, -4, -4, 1, -4, 1, 1, -4, -1, -4, -1, -1, -2, 5],
    [-4, -4, 5, -4, 1, -4, 1, -4, 1, -4, -1, -1, -4, -1, -2, -4],
    [-4, -4, -4, 5, 1, -4, -4, 1, -4, 1, -1, -1, -1, -4, -2, -4],
    [-4, -4, 1, 1, -1, -4, -2, -2, -2, -2, -1, -1, -3, -3, -1, -4],
    [1, 1, -4, -4, -4, -1, -2, -2, -2, -2, -3, -3, -1, -1, -1, 1],
    [1, -4, 1, -4, -2, -2, -1, -4, -2, -2, -3, -1, -3, -1, -1, -4],
    [-4, 1, -4, 1, -2, -2, -4, -1, -2, -2, -1, -3, -1, -3, -1, 1],
    [-4, 1, 1, -4, -2, -2, -2, -2, -1, -4, -1, -3, -3, -1, -1, 1],
    [1, -4, -4, 1, -2, -2, -2, -2, -4, -1, -3, -1, -1, -3, -1, -4],
    [-4, -1, -1, -1, -1, -3, -3, -1, -1, -3, -1, -2, -2, -2, -1, -1],
    [-1, -4, -1, -1, -1, -3, -1, -3, -3, -1, -2, -1, -2, -2, -1, -4],
    [-1, -1, -4, -1, -3, -1, -3, -1, -3, -1, -2, -2, -1, -2, -1, -1],
    [-1, -1, -1, -4, -3, -1, -1, -3, -1, -3, -2, -2, -2, -1, -1, -1],
    [-2, -2, -2, -2, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -2],
    [-4, 5, -4, -4, -4, 1, -4, 1, 1, -4, -1, -4, -1, -1, -2, 5]
  ]; // EDNAFULL
  const base_to_idx = {
    A: 0,
    C: 3,
    B: 10,
    D: 13,
    G: 2,
    H: 12,
    K: 8,
    M: 9,
    N: 14,
    S: 4,
    R: 6,
    U: 15,
    T: 1,
    W: 5,
    V: 11,
    Y: 7
  }; // for EDNAFULL
  var idx_to_base = {
    0: "A",
    1: "T",
    2: "G",
    3: "C",
    4: "S",
    5: "W",
    6: "R",
    7: "Y",
    8: "K",
    9: "M",
    10: "B",
    11: "V",
    12: "H",
    13: "D",
    14: "N",
    15: "U"
  }; // for EDNAFULL

  var ix = [],
    iy = [],
    m = [];
  var ixp, iyp, mp;

  var compass = [];

  var i, j;
  var cursor, cursorp;

  var p = [];
  const q = [];

  for (i = 0; i < a.length; i++) p.push(base_to_idx[a[i]]);
  for (i = 0; i < b.length; i++) q.push(base_to_idx[b[i]]);

  var lena = a.length;
  var lenb = b.length;

  var match = sub[p[0]][q[0]];
  var score;
  let testog, testeg, bconvcode, xpos, ypos, start1, start2, eps, b1, b2;

  var aln_a = [],
    aln_b = [],
    aln_r = [];

  ix[0] = -endgapopen - gapopen;
  iy[0] = -endgapopen - gapopen;
  m[0] = match;

  for (let ypos = 1; ypos < lena; ypos++) {
    match = sub[p[ypos]][q[0]];
    cursor = ypos * lenb;
    cursorp = (ypos - 1) * lenb;

    testog = m[cursorp] - gapopen;
    testeg = iy[cursorp] - gapextend;

    if (testog >= testeg) iy[cursor] = testog;
    else iy[cursor] = testeg;
    m[cursor] = match - (endgapopen + (ypos - 1) * endgapextend);
    ix[cursor] = -endgapopen - ypos * endgapextend - gapopen;
  }
  ix[cursor] -= endgapopen;
  ix[cursor] += gapopen;

  cursor = 0;

  for (let xpos = 1; xpos < lenb; xpos++) {
    match = sub[p[0]][q[xpos]];
    cursor = xpos;
    cursorp = xpos - 1;

    testog = m[cursorp] - gapopen;
    testeg = ix[cursorp] - gapextend;

    if (testog >= testeg) ix[cursor] = testog;
    else ix[cursor] = testeg;

    m[cursor] = match - (endgapopen + (xpos - 1) * endgapextend);
    iy[cursor] = -endgapopen - xpos * endgapextend - gapopen;
  }
  iy[cursor] -= endgapopen;
  iy[cursor] += gapopen;

  xpos = 1;
  while (xpos != lenb) {
    ypos = 1;
    bconvcode = q[xpos];

    cursorp = xpos - 1;
    cursor = xpos++;

    while (ypos < lena) {
      match = sub[p[ypos++]][bconvcode];
      cursor += lenb;

      mp = m[cursorp];
      ixp = ix[cursorp];
      iyp = iy[cursorp];

      if (mp > ixp && mp > iyp) m[cursor] = mp + match;
      else if (ixp > iyp) m[cursor] = ixp + match;
      else m[cursor] = iyp + match;

      cursorp += 1;
      if (xpos == lenb) {
        testog = m[cursorp] - endgapopen;
        testeg = iy[cursorp] - endgapextend;
      } else {
        testog = m[cursorp];
        if (testog < ix[cursorp]) testog = ix[cursorp];

        testog -= gapopen;
        testeg = iy[cursorp] - gapextend;
      }
      if (testog > testeg) iy[cursor] = testog;
      else iy[cursor] = testeg;

      cursorp += lenb;

      cursorp -= 1;
      if (ypos == lena) {
        testog = m[cursorp] - endgapopen;
        testeg = ix[cursorp] - endgapextend;
      } else {
        testog = m[cursorp];
        if (testog < iy[cursorp]) testog = iy[cursorp];
        testog -= gapopen;
        testeg = ix[cursorp] - gapextend;
      }
      if (testog > testeg) ix[cursor] = testog;
      else ix[cursor] = testeg;
    }
  }

  score = -32767; // INT_MIN
  start1 = lena - 1;
  start2 = lenb - 1;

  cursor = lena * lenb - 1;
  if (m[cursor] > ix[cursor] && m[cursor] > iy[cursor]) score = m[cursor];
  else if (ix[cursor] > iy[cursor]) score = ix[cursor];
  else score = iy[cursor];

  cursorp = 0;
  cursor = 1;

  eps = 1.192e-6;

  ypos = start1;
  xpos = start2;

  while (xpos >= 0 && ypos >= 0) {
    cursor = ypos * lenb + xpos;
    mp = m[cursor];

    if (
      cursorp == 1 &&
      E_FPEQ(
        ypos == 0 || ypos == lena - 1 ? endgapextend : gapextend,
        ix[cursor] - ix[cursor + 1],
        eps
      )
    ) {
      compass[cursor] = 1;
      xpos--;
    } else if (
      cursorp == 2 &&
      E_FPEQ(
        xpos == 0 || xpos == lenb - 1 ? endgapextend : gapextend,
        iy[cursor] - iy[cursor + lenb],
        eps
      )
    ) {
      compass[cursor] = 2;
      ypos--;
    } else if (mp >= ix[cursor] && mp >= iy[cursor]) {
      if (cursorp == 1 && E_FPEQ(mp, ix[cursor], eps)) {
        compass[cursor] = 1;
        xpos--;
      } else if (cursorp == 2 && E_FPEQ(mp, iy[cursor], eps)) {
        compass[cursor] = 2;
        ypos--;
      } else {
        compass[cursor] = 0;
        ypos--;
        xpos--;
      }
    } else if (ix[cursor] >= iy[cursor] && xpos > -1) {
      compass[cursor] = 1;
      xpos--;
    } else if (ypos > -1) {
      compass[cursor] = 2;
      ypos--;
    } else {
      alert("Needle: Something is seriously wrong in the traceback algorithm");
      return -1;
    }
    cursorp = compass[cursor];
  }

  for (i = lenb - 1; i > start2; ) {
    aln_b.push(idx_to_base[q[i--]]);
    aln_a.push("-");
    aln_r.push(" ");
  }
  for (j = lena - 1; j > start1; ) {
    aln_a.push(idx_to_base[p[j--]]);
    aln_b.push("-");
    aln_r.push(" ");
  }

  while (start2 >= 0 && start1 >= 0) {
    cursor = start1 * lenb + start2;
    if (!compass[cursor]) {
      /* diagonal */
      b1 = p[start1--];
      b2 = q[start2--];
      aln_a.push(idx_to_base[b1]);
      aln_b.push(idx_to_base[b2]);
      if (b1 == b2) aln_r.push("|");
      else aln_r.push(".");
      continue;
    } else if (compass[cursor] == 1) {
      /* Left, gap(s) in vertical */
      aln_a.push("-");
      aln_b.push(idx_to_base[q[start2--]]);
      aln_r.push(" ");
      continue;
    } else if (compass[cursor] == 2) {
      /* Down, gap(s) in horizontal */
      aln_a.push(idx_to_base[p[start1--]]);
      aln_b.push("-");
      aln_r.push(" ");
      continue;
    } else {
      alert("Needle: Walk Error in NW");
      return -1;
    }
  }

  for (; start2 >= 0; start2--) {
    aln_b.push(idx_to_base[q[start2]]);
    aln_a.push("-");
    aln_r.push(" ");
  }

  for (; start1 >= 0; start1--) {
    aln_a.push(idx_to_base[p[start1]]);
    aln_b.push("-");
    aln_r.push(" ");
  }

  aln_a = aln_a.reverse().join("");
  aln_b = aln_b.reverse().join("");
  aln_r = aln_r.reverse().join(""); //.replace(/ /gi, "&nbsp;");

  return [aln_a, aln_r, aln_b];
}

const helper = {
  revcompstr(s) {
    let i, l, _i, _ref;
    l = s.split("").reverse();
    for (i = _i = 0, _ref = l.length; _i < _ref; i = _i += 1) {
      if (l[i] === "A") {
        l[i] = "T";
      } else if (l[i] === "T") {
        l[i] = "A";
      } else if (l[i] === "G") {
        l[i] = "C";
      } else if (l[i] === "C") {
        l[i] = "G";
      } else if (l[i] === "a") {
        l[i] = "t";
      } else if (l[i] === "t") {
        l[i] = "a";
      } else if (l[i] === "g") {
        l[i] = "c";
      } else if (l[i] === "c") {
        l[i] = "g";
      }
    }
    return l.join("");
  },
  min(a, b) {
    return +a < +b ? a : b;
  },
  max(a, b) {
    return +a > +b ? a : b;
  },
  revcomp(fq) {
    fq.seq.s = this.comp(fq.seq.s).reverse();
    fq.qual.s = fq.qual.s.reverse();
    return fq;
  },
  comp(l) {
    var i, _i, _ref;
    for (i = _i = 0, _ref = l.length; _i < _ref; i = _i += 1) {
      if (l[i] === "A") {
        l[i] = "T";
      } else if (l[i] === "T") {
        l[i] = "A";
      } else if (l[i] === "G") {
        l[i] = "C";
      } else if (l[i] === "C") {
        l[i] = "G";
      } else if (l[i] === "a") {
        l[i] = "t";
      } else if (l[i] === "t") {
        l[i] = "a";
      } else if (l[i] === "g") {
        l[i] = "c";
      } else if (l[i] === "c") {
        l[i] = "g";
      }
    }
    return l;
  },
  hd(a, s, b, n) {
    let d = 0;
    let i = 0;
    while (n > 0) {
      if (a[s + i] !== b[i]) {
        d++;
      }
      n--;
      i++;
    }
    return d + n;
  },
  __modulo(a, b) {
    return ((+a % (b = +b)) + b) % b;
  },
  compare(a, b) {
    if (a.count < b.count) {
      return 1;
    }
    if (a.count > b.count) {
      return -1;
    }
    return 0;
  }
};

self.onmessage = e => {
  if (!e) return;
  const data = e.data;
  const store = {
    joins_length: 0,
    seq_count: {},
    chartIndex: [],
    changed: 0,
    change_target: {}
  };

  const lenStore = {};

  const pri_len = 15;
  const {
    rgen_type,
    seq_RGEN,
    seq_RGEN2,
    seq_wt,
    end_range,
    filt_n,
    filt_r,
    files,
    seq_hdr,
    targetSeq,
    changeSeq,
    fileId,
    nucleases
  } = data;
  let bp, m;
  if (rgen_type < 2) {
    const pattern = new RegExp(
      `(${seq_RGEN}|(${helper.revcompstr(seq_RGEN)}))`
    );
    m = pattern.exec(seq_wt);
    if (m) {
      if (rgen_type === 0) {
        bp = m[1] ? m.index + seq_RGEN.length - 3 : m.index + 3;
      } else if (rgen_type === 1) {
        bp = m[1] ? m.index + 21 : m.index + seq_RGEN.length - 16;
      }
    } else {
      post(
        1,
        "Could't find the target DNA (or sgRNA) sequences in the full reference sequences."
      );
      return;
    }
  } else {
    let pattern_1, pattern_2;
    if (rgen_type === 2) {
      pattern_1 = new RegExp(`(${seq_RGEN})`);
      pattern_2 = new RegExp(`(${seq_RGEN2})`);
    } else {
      pattern_1 = new RegExp(`(${seq_RGEN})|(${helper.revcompstr(seq_RGEN)})`);
      pattern_2 = new RegExp(`(${seq_RGEN})|(${helper.revcompstr(seq_RGEN2)})`);
    }
    const m_1 = pattern_1.exec(seq_wt);
    const m_2 = pattern_2.exec(seq_wt);
    if (m_1 && m_2) {
      if (m_1.index > m_2.index) {
        post(1, "Position of left site is bigger than that of right site!");
        return;
      }

      if (rgen_type < 4) {
        bp = Math.round((m_1.index + m_2.index + seq_RGEN2.length) / 2);
      } else if (rgen_type === 4) {
        const bp_1 = m_1[1] ? m_1.index + seq_RGEN.length - 3 : m_1.index + 3;
        const bp_2 = m_2[1] ? m_2.index + seq_RGEN2.length - 3 : m_2.index + 3;
        bp = Math.round((bp_1 + bp_2) / 2);
      } else {
        const bp_1 = m_1[1] ? m_1.index + 21 : m_1.index + seq_RGEN.length - 16;
        const bp_2 = m_2[1]
          ? m_2.index + 21
          : m_2.index + seq_RGEN2.length - 16;
        bp = Math.round((bp_1 + bp_2) / 2);
      }
    } else {
      post(1, "Couldn't find both sites in WT sequence!");
      return;
    }
  }

  let start_pos = bp - end_range;
  let end_pos = bp + end_range;
  if (start_pos < 0) start_pos = 0;
  if (end_pos > seq_wt.length) end_pos = seq_wt.length;

  // s_seq: WT marker sequence
  const s_seq = seq_wt.slice(bp - filt_r, bp + filt_r);
  // seq_range: indicator sequences + crRNA + WT marker Total
  const seq_range = seq_wt.slice(start_pos, end_pos);
  const pri_for = seq_range.slice(0, pri_len);
  const pri_back = seq_range.slice(-pri_len);
  const pri_for_patterns = [];
  const pri_back_patterns = [];
  for (let i = 0; i < pri_len; i++) {
    pri_for_patterns.push(
      pri_for.slice(0, i) + "[AGCT]" + pri_for.slice(i + 1)
    );
    pri_back_patterns.push(
      pri_back.slice(0, i) + "[AGCT]" + pri_back.slice(i + 1)
    );
  }

  // original seq francy
  const seq_fancy_wt = [];
  const eun_seq_fancy_wt = [];

  const setSeq = () => {
    eun_seq_fancy_wt.push({
      data: seq_wt.slice(0, start_pos),
      type: "normal"
    });

    eun_seq_fancy_wt.push({
      data: seq_wt.slice(start_pos, m.index),
      type: "primerSeq"
    });

    eun_seq_fancy_wt.push({
      data: seq_wt.slice(m.index, m.index + seq_RGEN.length),
      type: "rgenSeq"
    });

    eun_seq_fancy_wt.push({
      data: seq_wt.slice(m.index + seq_RGEN.length, end_pos),
      type: "primerSeq"
    });

    eun_seq_fancy_wt.push({
      data: seq_wt.slice(end_pos),
      type: "normal"
    });

    seq_fancy_wt.push({
      data: seq_wt.slice(0, start_pos),
      type: "normal"
    });
    seq_fancy_wt.push({
      data: seq_wt.slice(
        start_pos,
        helper.min(start_pos + pri_len, bp - filt_r)
      ),
      type: "primerSeq"
    });
    seq_fancy_wt.push({
      data: seq_wt.slice(start_pos + pri_len, helper.min(m.index, bp - filt_r)),
      type: "normal"
    });
    seq_fancy_wt.push({
      data: seq_wt.slice(m.index, bp - filt_r),
      type: "rgenSeq"
    });
    seq_fancy_wt.push({
      data: seq_wt.slice(bp - filt_r, bp + filt_r),
      type: "coreSeq"
    });
    seq_fancy_wt.push({
      data: seq_wt.slice(bp + filt_r, m.index + seq_RGEN.length),
      type: "rgenSeq"
    });
    seq_fancy_wt.push({
      data: seq_wt.slice(
        helper.max(m.index + seq_RGEN.length, bp + filt_r),
        end_pos - pri_len
      ),
      type: "normal"
    });
    seq_fancy_wt.push({
      data: seq_wt.slice(helper.max(end_pos - pri_len, bp + filt_r), end_pos),
      type: "primerSeq"
    });
    seq_fancy_wt.push({
      data: seq_wt.slice(end_pos),
      type: "normal"
    });
    // RGEN TOOL
    // post(0, seq_fancy_wt);

    // EUN
    post(0, eun_seq_fancy_wt);
  };

  setSeq();

  const _line = (function() {
    function _line() {
      this.s = "";
      this.n = 0;
    }
    return _line;
  })();

  // 변경된 sequence 찾음

  const findChangeSeq = list => {
    const lenVal = Object.values(lenStore);
    const lenKey = Object.keys(lenStore);
    const maxIndex = lenVal.indexOf(Math.max(...lenVal));
    const ORIGIN_LEN = +lenKey[maxIndex];
    store.standardLen = ORIGIN_LEN;

    for (let i = 0; i < list.length; i++) {
      const origin = list[i].origin;
      const change = list[i].change;
      const count = list[i].count;

      let changed = 0;
      const reg = new RegExp(seq_RGEN);
      const originTarget = origin.match(reg);
      if (
        !originTarget ||
        origin.length !== ORIGIN_LEN ||
        change.length !== ORIGIN_LEN
      ) {
        continue;
      }
      const changeTarget = change.slice(
        originTarget.index,
        originTarget.index + seq_RGEN.length
      );

      // store.change_target[list[i].id] = changeTarget;

      for (let i = 0; i < seq_RGEN.length; i++) {
        const a = seq_RGEN.charAt(i);
        const b = changeTarget.charAt(i);
        if (a === targetSeq) {
          if (b === changeSeq) {
            changed += 1;
          }
        }
        if (!store.chartIndex[i]) {
          store.chartIndex[i] = {
            [b]: 1 * count
          };
        } else if (!store.chartIndex[i][b]) {
          store.chartIndex[i][b] = 1 * count;
        } else {
          store.chartIndex[i][b] += 1 * count;
        }
      }
      if (changed >= 1) {
        store.changed += count;
      }
    }
  };

  const process_chunk = seqs => {
    let cut_seq;
    let flag_for;
    let flag_back;
    let end_pos;
    let start_pos;
    let err_cycle = 0;
    let err_v;

    for (let i = 0; i < seqs.length; i++) {
      const seq = seqs[i];
      flag_for = 0;
      flag_back = 0;

      for (let j = 0; j < pri_for_patterns.length; j++) {
        let pattern = pri_for_patterns[j];
        pattern = new RegExp(pattern);
        const m = pattern.exec(seq);
        if (m) {
          start_pos = m.index;
          flag_for = 1;
        }
      }

      for (let j = 0; j < pri_back_patterns.length; j++) {
        let pattern = pri_back_patterns[j];
        pattern = new RegExp(pattern);
        const m = pattern.exec(seq);
        if (m) {
          end_pos = m.index;
          flag_back = 1;
        }
      }

      if (flag_for && flag_back) {
        cut_seq = seq.slice(start_pos, end_pos + pri_len);
        if (cut_seq.length === 0) {
          err_cycle = 1;
          if (err_v === 0) {
            post(
              11,
              "Indicator sequences are found in wrong position. Please try another R value for this sample."
            );
            err_v = 1;
          }
        }
        if (cut_seq in store.seq_count && err_cycle === 0) {
          store.seq_count[cut_seq] += 1;
        } else {
          store.seq_count[cut_seq] = 1;
        }
      }
      store.joins_length += 1;
    }
  };

  const _fq = (function() {
    function _fq() {
      this.id = new _line();
      this.seq = new _line();
      this.com = new _line();
      this.qual = new _line();
    }
    return _fq;
  })();

  const _inflater = (function() {
    function _inflater() {
      var enable_windows_gzip, that, window_bits;
      window_bits = 15;
      enable_windows_gzip = 32;
      this.inflater_pako = new pako.Inflate({
        to: "string",
        chunkSize: 16384,
        windowBits: window_bits | enable_windows_gzip
      });
      this.inflating_buffer = "";
      that = this;
      this.inflater_pako.onData = function(chunk) {
        that.inflating_buffer += chunk;
      };
      return;
    }

    _inflater.prototype.decompress = function(chunk, islastchunk) {
      this.inflating_buffer = "";
      this.inflater_pako.push(chunk, islastchunk);
      this.ended = this.inflater_pako.ended;
      this.strm = this.inflater_pako.strm;
      return this.inflating_buffer;
    };

    return _inflater;
  })();

  const jbfilereadersync = (function() {
    function jbfilereadersync(file, gzipped) {
      this.file = file;
      this.gzipped = gzipped;
      this.buffer = "";
      this.filesize = this.file.size;
      this.chunksize = 1024 * 512;
      this.reader = new FileReaderSync();
      if (this.gzipped) {
        this.inflater = new _inflater();
      }
      this.islastchunk = false;
      this.fpos = 0;
      this.endpos = 0;
      this.eof = false;
      return;
    }

    jbfilereadersync.prototype._getchunk = function() {
      var blob, raw_array, rel_pos, remaining_bytes, s;
      if (this.fpos + this.chunksize >= this.filesize) {
        this.endpos = this.filesize;
        this.islastchunk = true;
      } else {
        this.endpos = this.fpos + this.chunksize;
      }
      blob = this.file.slice(this.fpos, this.endpos);
      this.fpos += this.endpos - this.fpos;
      if (this.gzipped) {
        raw_array = new Uint8Array(this.reader.readAsArrayBuffer(blob));
        s = this.inflater.decompress(raw_array, this.islastchunk);
        if (s) {
          if (
            this.inflater.ended &&
            (this.inflater.strm.avail_in || !this.islastchunk)
          ) {
            remaining_bytes = this.inflater.strm.avail_in;
            rel_pos = 0;
            while (
              raw_array[raw_array.byteLength - remaining_bytes + rel_pos] === 0
            ) {
              rel_pos++;
            }
            this.fpos -= remaining_bytes - rel_pos;
            this.inflater = new _inflater();
          }
        } else {
          throw new Error("Something wrong with the gzipped file!");
        }
      } else {
        s = this.reader.readAsText(blob);
      }
      return s;
    };

    jbfilereadersync.prototype.readline = function() {
      var lfpos, result;
      if (this.eof) {
        return "";
      }
      lfpos = this.buffer.indexOf("\n");
      while (lfpos === -1) {
        if (this.fpos >= this.filesize) {
          result = this.buffer;
          this.buffer = "";
          this.fpos = this.filesize;
          this.eof = true;
          return result;
        }
        this.buffer += this._getchunk();
        lfpos = this.buffer.indexOf("\n");
      }
      if (this.buffer[lfpos - 1] === "\r") {
        result = this.buffer.slice(0, lfpos - 1);
      } else {
        result = this.buffer.slice(0, lfpos);
      }
      this.buffer = this.buffer.slice(lfpos + 1);
      return result;
    };

    return jbfilereadersync;
  })();

  const jbfilereader = (function() {
    function jbfilereader(file, gzipped) {
      this.file = file;
      this.gzipped = gzipped;
      this.buffer = "";
      this.filesize = this.file.size;
      this.chunksize = 1024 * 512;
      this.reader = new FileReader();
      if (this.gzipped) {
        this.inflater = new _inflater();
      }
      this.islastchunk = false;
      this.fpos = 0;
      this.endpos = 0;
      this.eof = false;
      return;
    }

    jbfilereader.prototype._readblob = function(blob) {
      var readpromise, that;
      that = this;
      readpromise = new Promise(function(resolve, reject) {
        that.reader.onload = function(e) {
          return resolve(e.target.result);
        };
        that.reader.onerror = function() {
          return reject();
        };
      });
      if (this.gzipped) {
        this.reader.readAsArrayBuffer(blob);
      } else {
        this.reader.readAsText(blob);
      }
      return readpromise;
    };

    jbfilereader.prototype._getchunk = function() {
      var blob, chunkpromise, that;
      if (this.fpos + this.chunksize >= this.filesize) {
        this.endpos = this.filesize;
        this.islastchunk = true;
      } else {
        this.endpos = this.fpos + this.chunksize;
      }
      blob = this.file.slice(this.fpos, this.endpos);
      that = this;
      chunkpromise = new Promise(function(resolve, reject) {
        var readpromise;
        readpromise = that._readblob(blob);
        return readpromise
          .then(function(s) {
            var raw_array, rel_pos, remaining_bytes;
            that.fpos += that.endpos - that.fpos;
            if (that.gzipped) {
              raw_array = new Uint8Array(s);
              s = that.inflater.decompress(raw_array, that.islastchunk);
              if (s) {
                if (
                  that.inflater.ended &&
                  (that.inflater.strm.avail_in || !that.islastchunk)
                ) {
                  remaining_bytes = that.inflater.strm.avail_in;
                  rel_pos = 0;
                  while (
                    raw_array[
                      raw_array.byteLength - remaining_bytes + rel_pos
                    ] === 0
                  ) {
                    rel_pos++;
                  }
                  that.fpos -= remaining_bytes - rel_pos;
                  that.inflater = new _inflater();
                }
              } else {
                alert("Something wrong with the gzipped file!");
                reject();
              }
            }
            that.buffer += s;
            resolve();
          })
          ["catch"](function(s) {
            alert("Something wrong while reading file!");
            reject();
          });
      });
      return chunkpromise;
    };

    jbfilereader.prototype.readline = function(callback) {
      var datapromise, lfpos, result, that;
      if (this.eof) {
        callback("");
      }
      lfpos = this.buffer.indexOf("\n");
      if (lfpos === -1) {
        if (this.fpos >= this.filesize) {
          result = this.buffer;
          this.buffer = "";
          this.eof = true;
          callback(result);
        } else {
          that = this;
          datapromise = this._getchunk();
          datapromise.then(function() {
            return that.readline(callback);
          });
        }
      } else {
        if (this.buffer[lfpos] === "\r") {
          result = this.buffer.slice(0, lfpos - 1);
        } else {
          result = this.buffer.slice(0, lfpos);
        }
        this.buffer = this.buffer.slice(lfpos + 1);
        callback(result);
      }
    };

    return jbfilereader;
  })();

  const run_fastq_join = (
    files,
    pgcallback,
    chunkcallback,
    joinsonly = false,
    mino = 6,
    pctdiff = 8
  ) => {
    let hasex;
    let olen;
    let rtn;
    let d;
    let mind;
    let rc;
    let maxo;
    let bestscore;
    let score;
    let besto;
    let joincnt = 0;
    let tlen = 0;
    let tlensq = 0;
    let joins = [];
    const fq = [new _fq(), new _fq()];
    let nrec = 0;
    let prevfpos = 0;
    const steprec = 500;
    const readers = [0, 0];
    for (let i = 0; i < files.length; i++) {
      const entries = files[i].name.split(".");
      let gzipped = 0;
      if (entries[entries.length - 1] === "gz") {
        gzipped = 1;
      }
      readers[i] = new jbfilereadersync(files[i], gzipped);
    }

    const read_fq = () => {
      const eofs = [false, false];
      for (let j = 0; j < 2; j++) {
        for (let k = 0; k < 4; k++) {
          let line;
          try {
            line = readers[j].readline();
            if (line === "") {
              eofs[j] = true;
              break;
            }
          } catch (error) {
            post(1, error);
            return 2;
          }

          if (k === 0) {
            fq[j].id.s = line.split("");
            fq[j].id.n = fq[j].id.s.length;
          } else if (k === 1) {
            fq[j].seq.s = line.split("");
            fq[j].seq.n = fq[j].seq.s.length;
          } else if (k === 2) {
            fq[j].com.s = line.split("");
            fq[j].com.n = fq[j].com.s.length;
          } else if (k === 3) {
            fq[j].qual.s = line.split("");
            fq[j].qual.n = fq[j].qual.s.length;
          }
        }
        if (fq[j].id.n === 0 || (fq[j].id.n !== 0 && fq[j].id.s[0] !== "@")) {
          post(1, "Input files is not FASTQ!");
          return 2;
        }
      }
      if (
        (eofs[0] === true && eofs[1] === false) ||
        (eofs[0] === false && eofs[1] === true)
      ) {
        post(1, "# of rows in mate file doesnt's match primary file!");
        return 2;
      } else if (eofs[0] === true && eofs[1] === true) {
        return 1;
      } else {
        return 0;
      }
    };

    while (true) {
      nrec++;
      rtn = read_fq();
      if (rtn === 1) {
        break;
      } else if (rtn === 2) {
        return;
      }
      rc = helper.revcomp(fq[1]);
      maxo = helper.min(fq[0].seq.n, rc.seq.n);
      bestscore = 2147483647;
      besto = -1;
      for (let i = mino; i <= maxo; i++) {
        mind = Math.floor((pctdiff * i) / 100);
        d = helper.hd(fq[0].seq.s, fq[0].seq.n - i, rc.seq.s, i);
        if (d <= mind) {
          score = Math.floor((1000 * (d * d + 1)) / i);
          if (score < bestscore) {
            bestscore = score;
            besto = i;
          }
        }
      }
      hasex = 0;
      olen = besto - hasex;
      if (besto > 0) {
        joincnt++;
        tlen += olen;
        tlensq += Math.pow(olen, 2);
        for (let i = 0; i < besto; i++) {
          const li = fq[0].seq.n - besto + i;
          const ri = i;
          if (fq[0].seq.s[li] === rc.seq.s[ri]) {
            fq[0].qual.s[li] = String.fromCharCode(
              helper.max(
                fq[0].qual.s[li].charCodeAt(0),
                rc.qual.s[ri].charCodeAt(0)
              )
            );
          } else {
            if (fq[0].qual.s[li].charCodeAt(0) > rc.qual.s[ri].charCodeAt(0)) {
              fq[0].qual.s[li] = String.fromCharCode(
                33 +
                  helper.min(
                    fq[0].qual.s[li].charCodeAt(0),
                    helper.max(
                      fq[0].qual.s[li].charCodeAt(0) -
                        rc.qual.s[ri].charCodeAt(0),
                      3
                    )
                  )
              );
            } else {
              fq[0].seq.s[li] = rc.seq.s[ri];
              fq[0].qual.s[li] = String.fromCharCode(
                33 +
                  helper.min(
                    rc.qual.s[ri].charCodeAt(0),
                    helper.max(
                      rc.qual.s[ri].charCodeAt(0) -
                        fq[0].qual.s[li].charCodeAt(0),
                      3
                    )
                  )
              );
            }
          }
        }
        joins.push(
          fq[0].seq.s.join("") + rc.seq.s.slice(besto).join("") + "\n"
        );
      }
      // console.log(`modulo: ${helper.__modulo(nrec, steprec)}, nrec: ${nrec} steprec: ${steprec}`)
      if (helper.__modulo(nrec, steprec) === 0) {
        if (prevfpos !== readers[0].fpos) {
          pgcallback((readers[0].fpos * 100) / files[0].size);
          chunkcallback(joins);
          joins = [];
          prevfpos = readers[0].fpos;
        }
      }
    }

    chunkcallback(joins);
    pgcallback(100);
  };

  const run_cas_analyser = (seq_range, seq_hdr, filt_n, filt_r, pgcallback) => {
    const tot_results = [];
    const mut_results = [];
    const count_seqs = [];
    let totlr_count = 0;
    let query_cnt = 0;
    let tot_count = 0;
    let cnt_hdr = 0;
    let cnt_ins = 0;
    let cnt_del = 0;
    let dscnt = 1;
    let iscnt = 1;
    let re_gap = /-+/g;
    let length_range = seq_range.length;
    let n = Math.floor(Object.keys(store.seq_count).length / 20);
    let i = 0;
    for (let seq in store.seq_count) {
      if (!store.seq_count.hasOwnProperty(seq)) {
        continue;
      }

      const item_cnt = store.seq_count[seq];
      totlr_count += item_cnt;
      if (item_cnt > filt_n) {
        count_seqs.push({ seq: seq, count: item_cnt });
        tot_count += item_cnt;
      }

      if (i % n === 0) {
        pgcallback((i / Object.keys(store.seq_count).length) * 50);
      }
      i += 1;
    }
    pgcallback(50);
    count_seqs.sort(helper.compare);
    const data = {
      table: [],
      il: [],
      dl: [],
      is: [],
      ds: [],
      hdr: 0,
      fileId
    };
    for (let i = 0; i <= length_range; i++) {
      data.il.push([i, 0]);
      data.dl.push([i, 0]);
    }
    n = Math.floor(count_seqs.length / 20);
    const countLen = count_seqs.length;
    for (let i = 0; i < countLen; i++) {
      if (count_seqs[i].seq.length === 0) {
        continue;
      }
      const entry = {};
      const p = needle(seq_range, count_seqs[i].seq, 10, 0.5, 10, 0.5);
      const seqLength = count_seqs[i].seq.length;
      entry.id = i + 1;
      entry.origin = p[0];
      entry.change = p[2];
      entry.graphic = p[1];
      entry.length = seqLength;
      if (lenStore[seqLength]) {
        lenStore[seqLength] = ++lenStore[seqLength];
      } else {
        lenStore[seqLength] = 1;
      }
      entry.count = count_seqs[i].count;
      if (seq_range.length === entry.length) {
        entry.type = 0;
      } else {
        if (
          filt_r > 0 &&
          s_seq !== "" &&
          count_seqs[i].seq.indexOf(s_seq) > 0
        ) {
          entry.type = 0;
        } else {
          if (entry.length > seq_range.length) {
            // insertion
            entry.type = 1;
            cnt_ins += entry.count;
          } else {
            // deletion
            entry.type = 2;
            cnt_del += entry.count;
          }
        }
      }
      if (!seq_hdr || seq_hdr === "") {
        entry.hdr = -2;
      } else {
        entry.hdr = count_seqs[i].seq.indexOf(seq_hdr);
        if (entry.hdr > 0) {
          cnt_hdr += entry.count;
        }
      }
      data.table.push(entry);
      let cpos = 0;
      if (entry.type === 1) {
        while (true) {
          const m = re_gap.exec(entry.origin);
          if (m) {
            const gap = m[0];
            if (data.is.length < gap.length) {
              const len = gap.length - data.is.length;
              for (let j = 0; j <= len; j++) {
                data.is.push([iscnt++, 0]);
              }
            }
            data.is[gap.length - 1][1] += count_seqs[i].count;
          } else {
            break;
          }
        }
        for (let j = 0; j < entry.origin.length; j++) {
          if (entry.origin[j] !== "-") {
            cpos += 1;
            if (cpos >= seq_range.length) {
              break;
            }
            if (entry.origin[j + 1] === "-") {
              data.il[cpos][1] += count_seqs[i].count;
            }
          }
        }
      } else if (entry.type === 2) {
        while (true) {
          const m = re_gap.exec(entry.change);
          if (m) {
            const gap = m[0];
            if (data.ds.length < gap.length) {
              const loop = gap.length - data.ds.length;
              for (let j = 0; j <= loop; j++) {
                data.ds.push([dscnt++, 0]);
              }
            }
            data.ds[gap.length - 1][1] += count_seqs[i].count;
          } else {
            break;
          }
        }
        const originLoop = entry.origin.length;
        for (let j = 0; j <= originLoop; j++) {
          if (entry.change[j] === "-") {
            data.dl[cpos][1] += count_seqs[i].count;
          }
          if (entry.origin[j] !== "-") {
            cpos += 1;
          }
        }
      }

      if (i % n === 0) {
        pgcallback(50 + (50 * i) / (count_seqs.length - 1));
      }
    }
    findChangeSeq(data.table);
    for (let i = 0; i <= seq_range.length; i++) {
      data.il[i][1] /= tot_count;
      data.dl[i][1] /= tot_count;
      data.il[i][1] *= 100;
      data.dl[i][1] *= 100;
    }
    data.hdr = cnt_hdr;
    data.joins_length = store.joins_length;
    data.totlr_count = totlr_count;
    data.tot_count = tot_count;
    data.cnt_ins = cnt_ins;
    data.cnt_del = cnt_del;
    data.changed = store.changed;
    data.chartIndex = store.chartIndex;
    data.standardLen = store.standardLen;
    data.change_target = store.change_target;
    data.standard_seq = seq_range;
    data.seq_target = seq_RGEN;
    data.seq_type = nucleases;
    pgcallback(100);
    return data;
  };

  run_fastq_join(files, pgcallback, process_chunk, true);
  const final_data = run_cas_analyser(
    seq_range,
    seq_hdr,
    filt_n,
    filt_r,
    pgcallback
  );
  post(4, final_data);
};
