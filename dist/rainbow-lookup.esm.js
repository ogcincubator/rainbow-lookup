const ne = {
  FETCH_CONCEPT_SCHEMES: `
        PREFIX skos: <http://www.w3.org/2004/02/skos/core#>
        SELECT DISTINCT ?cs (MIN(?lbl) as ?label) WHERE { ?cs a skos:ConceptScheme ; skos:prefLabel ?lbl }
        GROUP BY ?cs
        ORDER BY ?label
    `,
  FETCH_CONCEPT_SCHEME_CONCEPTS: `
        PREFIX skos: <http://www.w3.org/2004/02/skos/core#>
        SELECT DISTINCT ?c (MIN(?lbl) as ?label) WHERE { ?c a skos:Concept ; skos:prefLabel ?lbl ; skos:inScheme <@@CS_URI@@> }
        GROUP BY ?c
        ORDER BY ?label
    `
}, K = {};
function ce(f, L, t = "POST") {
  return fetch(f, {
    method: t,
    body: L,
    headers: {
      Accept: "application/json",
      "Content-Type": "application/sparql-query"
    }
  });
}
async function ae(f) {
  var L, t;
  if (!K.hasOwnProperty(f)) {
    const w = await (await ce(f, ne.FETCH_CONCEPT_SCHEMES)).json();
    (t = (L = w == null ? void 0 : w.results) == null ? void 0 : L.bindings) != null && t.length ? K[f] = w.results.bindings.map((g) => ({
      label: g.label.value,
      uri: g.cs.value,
      loading: !1,
      concepts: null
    })) : K[f] = [];
  }
  return K[f];
}
async function le(f, L) {
  var w, g;
  const t = await ae(f), C = t == null ? void 0 : t.find((h) => h.uri === L);
  if (!C)
    return [];
  if (C.concepts === null) {
    const v = await (await ce(
      f,
      ne.FETCH_CONCEPT_SCHEME_CONCEPTS.replace("@@CS_URI@@", L)
    )).json();
    (g = (w = v == null ? void 0 : v.results) == null ? void 0 : w.bindings) != null && g.length && (C.concepts = v.results.bindings.map((O) => ({
      label: O.label.value,
      uri: O.c.value
    })));
  }
  return C.concepts || [];
}
function ue(f) {
  return f && f.__esModule && Object.prototype.hasOwnProperty.call(f, "default") ? f.default : f;
}
var Z = { exports: {} }, re;
function se() {
  return re || (re = 1, function(f, L) {
    var t;
    t = function() {
      function C(e, r) {
        (r == null || r > e.length) && (r = e.length);
        for (var n = 0, c = Array(r); n < r; n++) c[n] = e[n];
        return c;
      }
      function w(e, r, n) {
        return (r = function(c) {
          var a = function(l, s) {
            if (typeof l != "object" || !l) return l;
            var i = l[Symbol.toPrimitive];
            if (i !== void 0) {
              var o = i.call(l, s);
              if (typeof o != "object") return o;
              throw new TypeError("@@toPrimitive must return a primitive value.");
            }
            return (s === "string" ? String : Number)(l);
          }(c, "string");
          return typeof a == "symbol" ? a : a + "";
        }(r)) in e ? Object.defineProperty(e, r, { value: n, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = n, e;
      }
      function g(e, r) {
        var n = Object.keys(e);
        if (Object.getOwnPropertySymbols) {
          var c = Object.getOwnPropertySymbols(e);
          r && (c = c.filter(function(a) {
            return Object.getOwnPropertyDescriptor(e, a).enumerable;
          })), n.push.apply(n, c);
        }
        return n;
      }
      function h(e) {
        for (var r = 1; r < arguments.length; r++) {
          var n = arguments[r] != null ? arguments[r] : {};
          r % 2 ? g(Object(n), !0).forEach(function(c) {
            w(e, c, n[c]);
          }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(n)) : g(Object(n)).forEach(function(c) {
            Object.defineProperty(e, c, Object.getOwnPropertyDescriptor(n, c));
          });
        }
        return e;
      }
      function v(e) {
        return function(r) {
          if (Array.isArray(r)) return C(r);
        }(e) || function(r) {
          if (typeof Symbol < "u" && r[Symbol.iterator] != null || r["@@iterator"] != null) return Array.from(r);
        }(e) || k(e) || function() {
          throw new TypeError(`Invalid attempt to spread non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`);
        }();
      }
      function O(e) {
        return O = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(r) {
          return typeof r;
        } : function(r) {
          return r && typeof Symbol == "function" && r.constructor === Symbol && r !== Symbol.prototype ? "symbol" : typeof r;
        }, O(e);
      }
      function k(e, r) {
        if (e) {
          if (typeof e == "string") return C(e, r);
          var n = {}.toString.call(e).slice(8, -1);
          return n === "Object" && e.constructor && (n = e.constructor.name), n === "Map" || n === "Set" ? Array.from(e) : n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n) ? C(e, r) : void 0;
        }
      }
      var A = function(e) {
        return typeof e == "string" ? document.querySelector(e) : e();
      }, y = function(e, r) {
        var n = typeof e == "string" ? document.createElement(e) : e;
        for (var c in r) {
          var a = r[c];
          if (c === "inside") a.append(n);
          else if (c === "dest") A(a[0]).insertAdjacentElement(a[1], n);
          else if (c === "around") {
            var l = a;
            l.parentNode.insertBefore(n, l), n.append(l), l.getAttribute("autofocus") != null && l.focus();
          } else c in n ? n[c] = a : n.setAttribute(c, a);
        }
        return n;
      }, N = function(e, r) {
        return e = String(e).toLowerCase(), r ? e.normalize("NFD").replace(/[\u0300-\u036f]/g, "").normalize("NFC") : e;
      }, H = function(e, r) {
        return y("mark", h({ innerHTML: e }, typeof r == "string" && { class: r })).outerHTML;
      }, E = function(e, r) {
        r.input.dispatchEvent(new CustomEvent(e, { bubbles: !0, detail: r.feedback, cancelable: !0 }));
      }, R = function(e, r, n) {
        var c = n || {}, a = c.mode, l = c.diacritics, s = c.highlight, i = N(r, l);
        if (r = String(r), e = N(e, l), a === "loose") {
          var o = (e = e.replace(/ /g, "")).length, u = 0, d = Array.from(r).map(function(b, p) {
            return u < o && i[p] === e[u] && (b = s ? H(b, s) : b, u++), b;
          }).join("");
          if (u === o) return d;
        } else {
          var m = i.indexOf(e);
          if (~m) return e = r.substring(m, m + e.length), m = s ? r.replace(e, H(e, s)) : r;
        }
      }, V = function(e, r) {
        return new Promise(function(n, c) {
          var a;
          return (a = e.data).cache && a.store ? n() : new Promise(function(l, s) {
            return typeof a.src == "function" ? new Promise(function(i, o) {
              return a.src.constructor.name === "AsyncFunction" ? a.src(r).then(i, o) : i(a.src(r));
            }).then(l, s) : l(a.src);
          }).then(function(l) {
            try {
              return e.feedback = a.store = l, E("response", e), n();
            } catch (s) {
              return c(s);
            }
          }, c);
        });
      }, ee = function(e, r) {
        var n = r.data, c = r.searchEngine, a = [];
        n.store.forEach(function(s, i) {
          var o = function(m) {
            var b = m ? s[m] : s, p = typeof c == "function" ? c(e, b) : R(e, b, { mode: c, diacritics: r.diacritics, highlight: r.resultItem.highlight });
            if (p) {
              var _ = { match: p, value: s };
              m && (_.key = m), a.push(_);
            }
          };
          if (n.keys) {
            var u, d = function(m, b) {
              var p = typeof Symbol < "u" && m[Symbol.iterator] || m["@@iterator"];
              if (!p) {
                if (Array.isArray(m) || (p = k(m)) || b) {
                  p && (m = p);
                  var _ = 0, Q = function() {
                  };
                  return { s: Q, n: function() {
                    return _ >= m.length ? { done: !0 } : { done: !1, value: m[_++] };
                  }, e: function(j) {
                    throw j;
                  }, f: Q };
                }
                throw new TypeError(`Invalid attempt to iterate non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`);
              }
              var z, G = !0, $ = !1;
              return { s: function() {
                p = p.call(m);
              }, n: function() {
                var j = p.next();
                return G = j.done, j;
              }, e: function(j) {
                $ = !0, z = j;
              }, f: function() {
                try {
                  G || p.return == null || p.return();
                } finally {
                  if ($) throw z;
                }
              } };
            }(n.keys);
            try {
              for (d.s(); !(u = d.n()).done; ) o(u.value);
            } catch (m) {
              d.e(m);
            } finally {
              d.f();
            }
          } else o();
        }), n.filter && (a = n.filter(a));
        var l = a.slice(0, r.resultsList.maxResults);
        r.feedback = { query: e, matches: a, results: l }, E("results", r);
      }, D = "aria-expanded", B = "aria-activedescendant", q = "aria-selected", U = function(e, r) {
        e.feedback.selection = h({ index: r }, e.feedback.results[r]);
      }, J = function(e) {
        e.isOpen || ((e.wrapper || e.input).setAttribute(D, !0), e.list.removeAttribute("hidden"), e.isOpen = !0, E("open", e));
      }, P = function(e) {
        e.isOpen && ((e.wrapper || e.input).setAttribute(D, !1), e.input.setAttribute(B, ""), e.list.setAttribute("hidden", ""), e.isOpen = !1, E("close", e));
      }, x = function(e, r) {
        var n = r.resultItem, c = r.list.getElementsByTagName(n.tag), a = !!n.selected && n.selected.split(" ");
        if (r.isOpen && c.length) {
          var l, s, i = r.cursor;
          e >= c.length && (e = 0), e < 0 && (e = c.length - 1), r.cursor = e, i > -1 && (c[i].removeAttribute(q), a && (s = c[i].classList).remove.apply(s, v(a))), c[e].setAttribute(q, !0), a && (l = c[e].classList).add.apply(l, v(a)), r.input.setAttribute(B, c[r.cursor].id), r.list.scrollTop = c[e].offsetTop - r.list.clientHeight + c[e].clientHeight + 5, r.feedback.cursor = r.cursor, U(r, e), E("navigate", r);
        }
      }, S = function(e) {
        x(e.cursor + 1, e);
      }, T = function(e) {
        x(e.cursor - 1, e);
      }, M = function(e, r, n) {
        (n = n >= 0 ? n : e.cursor) < 0 || (e.feedback.event = r, U(e, n), E("selection", e), P(e));
      };
      function W(e, r) {
        var n = this;
        return new Promise(function(c, a) {
          var l, s;
          return l = r || ((s = e.input) instanceof HTMLInputElement || s instanceof HTMLTextAreaElement ? s.value : s.innerHTML), function(o, u, d) {
            return u ? u(o) : o.length >= d;
          }(l = e.query ? e.query(l) : l, e.trigger, e.threshold) ? V(e, l).then(function(o) {
            try {
              return e.feedback instanceof Error ? c() : (ee(l, e), e.resultsList && function(u) {
                var d = u.resultsList, m = u.list, b = u.resultItem, p = u.feedback, _ = p.matches, Q = p.results;
                if (u.cursor = -1, m.innerHTML = "", _.length || d.noResults) {
                  var z = new DocumentFragment();
                  Q.forEach(function(G, $) {
                    var j = y(b.tag, h({ id: "".concat(b.id, "_").concat($), role: "option", innerHTML: G.match, inside: z }, b.class && { class: b.class }));
                    b.element && b.element(j, G);
                  }), m.append(z), d.element && d.element(m, p), J(u);
                } else P(u);
              }(e), i.call(n));
            } catch (u) {
              return a(u);
            }
          }, a) : (P(e), i.call(n));
          function i() {
            return c();
          }
        });
      }
      var F = function(e, r) {
        for (var n in e) for (var c in e[n]) r(n, c);
      }, X = function(e) {
        var r, n, c, a = e.events, l = (r = function() {
          return W(e);
        }, n = e.debounce, function() {
          clearTimeout(c), c = setTimeout(function() {
            return r();
          }, n);
        }), s = e.events = h({ input: h({}, a && a.input) }, e.resultsList && { list: a ? h({}, a.list) : {} }), i = { input: { input: function() {
          l();
        }, keydown: function(o) {
          (function(u, d) {
            switch (u.keyCode) {
              case 40:
              case 38:
                u.preventDefault(), u.keyCode === 40 ? S(d) : T(d);
                break;
              case 13:
                d.submit || u.preventDefault(), d.cursor >= 0 && M(d, u);
                break;
              case 9:
                d.resultsList.tabSelect && d.cursor >= 0 && M(d, u);
                break;
              case 27:
                d.input.value = "", E("clear", d), P(d);
            }
          })(o, e);
        }, blur: function() {
          P(e);
        } }, list: { mousedown: function(o) {
          o.preventDefault();
        }, click: function(o) {
          (function(u, d) {
            var m = d.resultItem.tag.toUpperCase(), b = Array.from(d.list.querySelectorAll(m)), p = u.target.closest(m);
            p && p.nodeName === m && M(d, u, b.indexOf(p));
          })(o, e);
        } } };
        F(i, function(o, u) {
          (e.resultsList || u === "input") && (s[o][u] || (s[o][u] = i[o][u]));
        }), F(s, function(o, u) {
          e[o].addEventListener(u, s[o][u]);
        });
      };
      function Y(e) {
        var r = this;
        return new Promise(function(n, c) {
          var a, l, s;
          if (a = e.placeHolder, s = { role: "combobox", "aria-owns": (l = e.resultsList).id, "aria-haspopup": !0, "aria-expanded": !1 }, y(e.input, h(h({ "aria-controls": l.id, "aria-autocomplete": "both" }, a && { placeholder: a }), !e.wrapper && h({}, s))), e.wrapper && (e.wrapper = y("div", h({ around: e.input, class: e.name + "_wrapper" }, s))), l && (e.list = y(l.tag, h({ dest: [l.destination, l.position], id: l.id, role: "listbox", hidden: "hidden" }, l.class && { class: l.class }))), X(e), e.data.cache) return V(e).then(function(o) {
            try {
              return i.call(r);
            } catch (u) {
              return c(u);
            }
          }, c);
          function i() {
            return E("init", e), n();
          }
          return i.call(r);
        });
      }
      function I(e) {
        var r = e.prototype;
        r.init = function() {
          Y(this);
        }, r.start = function(n) {
          W(this, n);
        }, r.unInit = function() {
          if (this.wrapper) {
            var n = this.wrapper.parentNode;
            n.insertBefore(this.input, this.wrapper), n.removeChild(this.wrapper);
          }
          var c;
          F((c = this).events, function(a, l) {
            c[a].removeEventListener(l, c.events[a][l]);
          });
        }, r.open = function() {
          J(this);
        }, r.close = function() {
          P(this);
        }, r.goTo = function(n) {
          x(n, this);
        }, r.next = function() {
          S(this);
        }, r.previous = function() {
          T(this);
        }, r.select = function(n) {
          M(this, null, n);
        }, r.search = function(n, c, a) {
          return R(n, c, a);
        };
      }
      return function e(r) {
        this.options = r, this.id = e.instances = (e.instances || 0) + 1, this.name = "autoComplete", this.wrapper = 1, this.threshold = 1, this.debounce = 0, this.resultsList = { position: "afterend", tag: "ul", maxResults: 5 }, this.resultItem = { tag: "li" }, function(n) {
          var c = n.name, a = n.options, l = n.resultsList, s = n.resultItem;
          for (var i in a) if (O(a[i]) === "object") for (var o in n[i] || (n[i] = {}), a[i]) n[i][o] = a[i][o];
          else n[i] = a[i];
          n.selector = n.selector || "#" + c, l.destination = l.destination || n.selector, l.id = l.id || c + "_list_" + n.id, s.id = s.id || c + "_result", n.input = A(n.selector);
        }(this), I.call(this, e), Y(this);
      };
    }, f.exports = t();
  }(Z)), Z.exports;
}
var ie = se();
const te = /* @__PURE__ */ ue(ie);
function oe(f, L, t) {
  var D, B, q, U, J, P, x;
  const C = document.createElement("div");
  C.className = "no-results no-results-concept-schemes", C.innerHTML = ((D = t == null ? void 0 : t.noResults) == null ? void 0 : D.concepts) || "No concept schemes found";
  const w = document.createElement("div");
  w.className = "error error-concept-schemes", w.innerHTML = ((B = t == null ? void 0 : t.errorMessages) == null ? void 0 : B.conceptSchemes) || "Error retrieving concept schemes";
  const g = document.createElement("input"), h = document.createElement("input"), v = document.createElement("div"), O = document.createElement("div"), k = document.createElement("div"), A = document.createElement("div");
  let y = null, N = null, H = null, E, R;
  return typeof (t == null ? void 0 : t.inputClasses) == "string" ? E = R = t == null ? void 0 : t.inputClasses : (E = ((q = t == null ? void 0 : t.inputClasses) == null ? void 0 : q.conceptScheme) || "", R = ((U = t == null ? void 0 : t.inputClasses) == null ? void 0 : U.concept) || ""), g.className = "concept-scheme-input " + E, h.className = "concept-input " + R, v.className = "no-results no-results-concepts", O.className = "loading loading-concept-schemes", O.innerHTML = ((J = t == null ? void 0 : t.loading) == null ? void 0 : J.conceptSchemes) || "Loading...", f.append(O), k.style.display = "none", k.className = "loading loading-concepts", k.innerHTML = ((P = t == null ? void 0 : t.loading) == null ? void 0 : P.concepts) || "Loading concepts...", A.style.display = "none", A.className = "error error-concepts", A.innerHTML = ((x = t == null ? void 0 : t.errorMessages) == null ? void 0 : x.concepts) || "Error retrieving concepts", ae(L).then((S) => {
    var X, Y;
    if (t != null && t.conceptSchemeFilter && (S = S.filter(t.conceptSchemeFilter)), (X = t == null ? void 0 : t.onConceptSchemesLoaded) == null || X.call(t, S), !S.length) {
      f.append(C);
      return;
    }
    v.style.display = "none", v.innerHTML = ((Y = t == null ? void 0 : t.noResults) == null ? void 0 : Y.concepts) || "No concepts found", h.style.display = "none", f.append(g), f.append(v), f.append(k), f.append(A), f.append(h);
    const T = (I) => I.toLowerCase(), M = (I, e) => {
      if (e.label.toLowerCase().includes(I))
        return e.label;
    }, W = new te({
      name: "rainbow-concept-schemes",
      selector: () => g,
      placeHolder: "Concept scheme",
      threshold: 0,
      data: {
        src: () => S
      },
      query: T,
      searchEngine: M,
      resultsList: {
        class: "rainbow-autocomplete-results concept-schemes",
        maxResults: void 0
      },
      resultItem: {
        class: "rainbow-autocomplete-result concept-scheme"
      },
      events: {
        input: {
          focus() {
            W.start();
          },
          async selection(I) {
            var r, n, c;
            const e = I.detail.selection.value;
            if (!(y && (e == null ? void 0 : e.uri) === y.uri) && (y = e, h.style.display = "none", h.value = "", v.style.display = "none", A.style.display = "none", y != null)) {
              g.value = y.label, (r = t == null ? void 0 : t.onConceptSchemeSelected) == null || r.call(t, y), k.style.display = "";
              try {
                N = await le(L, y.uri), t != null && t.conceptFilter && (N = N.filter((a) => {
                  var l;
                  return (l = t == null ? void 0 : t.conceptFilter) == null ? void 0 : l.call(t, a, y);
                })), (n = t == null ? void 0 : t.onConceptSchemeLoaded) == null || n.call(t, y, N), N.length ? (h.style.display = "", h.focus(), F.start()) : v.style.display = "";
              } catch (a) {
                A.style.display = "", (c = t == null ? void 0 : t.onError) == null || c.call(t, "loadConcepts", a);
              } finally {
                k.style.display = "none";
              }
            }
          }
        }
      }
    }), F = new te({
      name: "rainbow-concepts",
      selector: () => h,
      placeHolder: "Concept",
      threshold: 0,
      data: {
        src: () => N || []
      },
      query: T,
      searchEngine: M,
      resultsList: {
        class: "rainbow-autocomplete-results concept-schemes",
        maxResults: void 0
      },
      resultItem: {
        class: "rainbow-autocomplete-result concept-scheme"
      },
      events: {
        input: {
          focus() {
            F.start();
          },
          selection(I) {
            var e;
            H = I.detail.selection.value, h.value = H.label, (e = t == null ? void 0 : t.onConceptSelected) == null || e.call(t, H);
          }
        }
      }
    });
  }).catch((S) => {
    var T;
    f.append(w), (T = t == null ? void 0 : t.onError) == null || T.call(t, "loadConceptSchemes", S);
  }).finally(() => {
    f.removeChild(O);
  }), {
    reset: () => {
      var S, T;
      g.value = "", y = null, h.style.display = "none", h.value = "", v.style.display = "none", (S = t == null ? void 0 : t.onConceptSchemeSelected) == null || S.call(t, null), (T = t == null ? void 0 : t.onConceptSelected) == null || T.call(t, null);
    },
    getSelection: () => ({
      conceptScheme: y ? JSON.parse(JSON.stringify(y)) : null,
      concept: H ? JSON.parse(JSON.stringify(H)) : null
    })
  };
}
export {
  oe as create
};
