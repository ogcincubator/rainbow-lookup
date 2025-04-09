const te = {
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
}, V = {};
function ce(f, O, t = "POST") {
  return fetch(f, {
    method: t,
    body: O,
    headers: {
      Accept: "application/json",
      "Content-Type": "application/sparql-query"
    }
  });
}
async function ae(f) {
  var O, t;
  if (!V.hasOwnProperty(f)) {
    const E = await (await ce(f, te.FETCH_CONCEPT_SCHEMES)).json();
    (t = (O = E == null ? void 0 : E.results) == null ? void 0 : O.bindings) != null && t.length ? V[f] = E.results.bindings.map((C) => ({
      label: C.label.value,
      uri: C.cs.value,
      loading: !1,
      concepts: null
    })) : V[f] = [];
  }
  return V[f];
}
async function se(f, O) {
  var E, C;
  const t = await ae(f), w = t == null ? void 0 : t.find((p) => p.uri === O);
  if (!w)
    return [];
  if (w.concepts === null) {
    const b = await (await ce(
      f,
      te.FETCH_CONCEPT_SCHEME_CONCEPTS.replace("@@CS_URI@@", O)
    )).json();
    (C = (E = b == null ? void 0 : b.results) == null ? void 0 : E.bindings) != null && C.length && (w.concepts = b.results.bindings.map((k) => ({
      label: k.label.value,
      uri: k.c.value
    })));
  }
  return w.concepts || [];
}
function ue(f) {
  return f && f.__esModule && Object.prototype.hasOwnProperty.call(f, "default") ? f.default : f;
}
var ee = { exports: {} }, re;
function le() {
  return re || (re = 1, function(f, O) {
    var t;
    t = function() {
      function w(e, r) {
        (r == null || r > e.length) && (r = e.length);
        for (var n = 0, c = Array(r); n < r; n++) c[n] = e[n];
        return c;
      }
      function E(e, r, n) {
        return (r = function(c) {
          var a = function(s, l) {
            if (typeof s != "object" || !s) return s;
            var i = s[Symbol.toPrimitive];
            if (i !== void 0) {
              var o = i.call(s, l);
              if (typeof o != "object") return o;
              throw new TypeError("@@toPrimitive must return a primitive value.");
            }
            return (l === "string" ? String : Number)(s);
          }(c, "string");
          return typeof a == "symbol" ? a : a + "";
        }(r)) in e ? Object.defineProperty(e, r, { value: n, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = n, e;
      }
      function C(e, r) {
        var n = Object.keys(e);
        if (Object.getOwnPropertySymbols) {
          var c = Object.getOwnPropertySymbols(e);
          r && (c = c.filter(function(a) {
            return Object.getOwnPropertyDescriptor(e, a).enumerable;
          })), n.push.apply(n, c);
        }
        return n;
      }
      function p(e) {
        for (var r = 1; r < arguments.length; r++) {
          var n = arguments[r] != null ? arguments[r] : {};
          r % 2 ? C(Object(n), !0).forEach(function(c) {
            E(e, c, n[c]);
          }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(n)) : C(Object(n)).forEach(function(c) {
            Object.defineProperty(e, c, Object.getOwnPropertyDescriptor(n, c));
          });
        }
        return e;
      }
      function b(e) {
        return function(r) {
          if (Array.isArray(r)) return w(r);
        }(e) || function(r) {
          if (typeof Symbol < "u" && r[Symbol.iterator] != null || r["@@iterator"] != null) return Array.from(r);
        }(e) || A(e) || function() {
          throw new TypeError(`Invalid attempt to spread non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`);
        }();
      }
      function k(e) {
        return k = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(r) {
          return typeof r;
        } : function(r) {
          return r && typeof Symbol == "function" && r.constructor === Symbol && r !== Symbol.prototype ? "symbol" : typeof r;
        }, k(e);
      }
      function A(e, r) {
        if (e) {
          if (typeof e == "string") return w(e, r);
          var n = {}.toString.call(e).slice(8, -1);
          return n === "Object" && e.constructor && (n = e.constructor.name), n === "Map" || n === "Set" ? Array.from(e) : n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n) ? w(e, r) : void 0;
        }
      }
      var P = function(e) {
        return typeof e == "string" ? document.querySelector(e) : e();
      }, v = function(e, r) {
        var n = typeof e == "string" ? document.createElement(e) : e;
        for (var c in r) {
          var a = r[c];
          if (c === "inside") a.append(n);
          else if (c === "dest") P(a[0]).insertAdjacentElement(a[1], n);
          else if (c === "around") {
            var s = a;
            s.parentNode.insertBefore(n, s), n.append(s), s.getAttribute("autofocus") != null && s.focus();
          } else c in n ? n[c] = a : n.setAttribute(c, a);
        }
        return n;
      }, N = function(e, r) {
        return e = String(e).toLowerCase(), r ? e.normalize("NFD").replace(/[\u0300-\u036f]/g, "").normalize("NFC") : e;
      }, R = function(e, r) {
        return v("mark", p({ innerHTML: e }, typeof r == "string" && { class: r })).outerHTML;
      }, L = function(e, r) {
        r.input.dispatchEvent(new CustomEvent(e, { bubbles: !0, detail: r.feedback, cancelable: !0 }));
      }, Z = function(e, r, n) {
        var c = n || {}, a = c.mode, s = c.diacritics, l = c.highlight, i = N(r, s);
        if (r = String(r), e = N(e, s), a === "loose") {
          var o = (e = e.replace(/ /g, "")).length, u = 0, d = Array.from(r).map(function(y, h) {
            return u < o && i[h] === e[u] && (y = l ? R(y, l) : y, u++), y;
          }).join("");
          if (u === o) return d;
        } else {
          var m = i.indexOf(e);
          if (~m) return e = r.substring(m, m + e.length), m = l ? r.replace(e, R(e, l)) : r;
        }
      }, D = function(e, r) {
        return new Promise(function(n, c) {
          var a;
          return (a = e.data).cache && a.store ? n() : new Promise(function(s, l) {
            return typeof a.src == "function" ? new Promise(function(i, o) {
              return a.src.constructor.name === "AsyncFunction" ? a.src(r).then(i, o) : i(a.src(r));
            }).then(s, l) : s(a.src);
          }).then(function(s) {
            try {
              return e.feedback = a.store = s, L("response", e), n();
            } catch (l) {
              return c(l);
            }
          }, c);
        });
      }, Q = function(e, r) {
        var n = r.data, c = r.searchEngine, a = [];
        n.store.forEach(function(l, i) {
          var o = function(m) {
            var y = m ? l[m] : l, h = typeof c == "function" ? c(e, y) : Z(e, y, { mode: c, diacritics: r.diacritics, highlight: r.resultItem.highlight });
            if (h) {
              var _ = { match: h, value: l };
              m && (_.key = m), a.push(_);
            }
          };
          if (n.keys) {
            var u, d = function(m, y) {
              var h = typeof Symbol < "u" && m[Symbol.iterator] || m["@@iterator"];
              if (!h) {
                if (Array.isArray(m) || (h = A(m)) || y) {
                  h && (m = h);
                  var _ = 0, J = function() {
                  };
                  return { s: J, n: function() {
                    return _ >= m.length ? { done: !0 } : { done: !1, value: m[_++] };
                  }, e: function(H) {
                    throw H;
                  }, f: J };
                }
                throw new TypeError(`Invalid attempt to iterate non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`);
              }
              var W, X = !0, K = !1;
              return { s: function() {
                h = h.call(m);
              }, n: function() {
                var H = h.next();
                return X = H.done, H;
              }, e: function(H) {
                K = !0, W = H;
              }, f: function() {
                try {
                  X || h.return == null || h.return();
                } finally {
                  if (K) throw W;
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
        var s = a.slice(0, r.resultsList.maxResults);
        r.feedback = { query: e, matches: a, results: s }, L("results", r);
      }, F = "aria-expanded", B = "aria-activedescendant", q = "aria-selected", U = function(e, r) {
        e.feedback.selection = p({ index: r }, e.feedback.results[r]);
      }, Y = function(e) {
        e.isOpen || ((e.wrapper || e.input).setAttribute(F, !0), e.list.removeAttribute("hidden"), e.isOpen = !0, L("open", e));
      }, g = function(e) {
        e.isOpen && ((e.wrapper || e.input).setAttribute(F, !1), e.input.setAttribute(B, ""), e.list.setAttribute("hidden", ""), e.isOpen = !1, L("close", e));
      }, T = function(e, r) {
        var n = r.resultItem, c = r.list.getElementsByTagName(n.tag), a = !!n.selected && n.selected.split(" ");
        if (r.isOpen && c.length) {
          var s, l, i = r.cursor;
          e >= c.length && (e = 0), e < 0 && (e = c.length - 1), r.cursor = e, i > -1 && (c[i].removeAttribute(q), a && (l = c[i].classList).remove.apply(l, b(a))), c[e].setAttribute(q, !0), a && (s = c[e].classList).add.apply(s, b(a)), r.input.setAttribute(B, c[r.cursor].id), r.list.scrollTop = c[e].offsetTop - r.list.clientHeight + c[e].clientHeight + 5, r.feedback.cursor = r.cursor, U(r, e), L("navigate", r);
        }
      }, z = function(e) {
        T(e.cursor + 1, e);
      }, $ = function(e) {
        T(e.cursor - 1, e);
      }, j = function(e, r, n) {
        (n = n >= 0 ? n : e.cursor) < 0 || (e.feedback.event = r, U(e, n), L("selection", e), g(e));
      };
      function G(e, r) {
        var n = this;
        return new Promise(function(c, a) {
          var s, l;
          return s = r || ((l = e.input) instanceof HTMLInputElement || l instanceof HTMLTextAreaElement ? l.value : l.innerHTML), function(o, u, d) {
            return u ? u(o) : o.length >= d;
          }(s = e.query ? e.query(s) : s, e.trigger, e.threshold) ? D(e, s).then(function(o) {
            try {
              return e.feedback instanceof Error ? c() : (Q(s, e), e.resultsList && function(u) {
                var d = u.resultsList, m = u.list, y = u.resultItem, h = u.feedback, _ = h.matches, J = h.results;
                if (u.cursor = -1, m.innerHTML = "", _.length || d.noResults) {
                  var W = new DocumentFragment();
                  J.forEach(function(X, K) {
                    var H = v(y.tag, p({ id: "".concat(y.id, "_").concat(K), role: "option", innerHTML: X.match, inside: W }, y.class && { class: y.class }));
                    y.element && y.element(H, X);
                  }), m.append(W), d.element && d.element(m, h), Y(u);
                } else g(u);
              }(e), i.call(n));
            } catch (u) {
              return a(u);
            }
          }, a) : (g(e), i.call(n));
          function i() {
            return c();
          }
        });
      }
      var x = function(e, r) {
        for (var n in e) for (var c in e[n]) r(n, c);
      }, I = function(e) {
        var r, n, c, a = e.events, s = (r = function() {
          return G(e);
        }, n = e.debounce, function() {
          clearTimeout(c), c = setTimeout(function() {
            return r();
          }, n);
        }), l = e.events = p({ input: p({}, a && a.input) }, e.resultsList && { list: a ? p({}, a.list) : {} }), i = { input: { input: function() {
          s();
        }, keydown: function(o) {
          (function(u, d) {
            switch (u.keyCode) {
              case 40:
              case 38:
                u.preventDefault(), u.keyCode === 40 ? z(d) : $(d);
                break;
              case 13:
                d.submit || u.preventDefault(), d.cursor >= 0 && j(d, u);
                break;
              case 9:
                d.resultsList.tabSelect && d.cursor >= 0 && j(d, u);
                break;
              case 27:
                d.input.value = "", L("clear", d), g(d);
            }
          })(o, e);
        }, blur: function() {
          g(e);
        } }, list: { mousedown: function(o) {
          o.preventDefault();
        }, click: function(o) {
          (function(u, d) {
            var m = d.resultItem.tag.toUpperCase(), y = Array.from(d.list.querySelectorAll(m)), h = u.target.closest(m);
            h && h.nodeName === m && j(d, u, y.indexOf(h));
          })(o, e);
        } } };
        x(i, function(o, u) {
          (e.resultsList || u === "input") && (l[o][u] || (l[o][u] = i[o][u]));
        }), x(l, function(o, u) {
          e[o].addEventListener(u, l[o][u]);
        });
      };
      function S(e) {
        var r = this;
        return new Promise(function(n, c) {
          var a, s, l;
          if (a = e.placeHolder, l = { role: "combobox", "aria-owns": (s = e.resultsList).id, "aria-haspopup": !0, "aria-expanded": !1 }, v(e.input, p(p({ "aria-controls": s.id, "aria-autocomplete": "both" }, a && { placeholder: a }), !e.wrapper && p({}, l))), e.wrapper && (e.wrapper = v("div", p({ around: e.input, class: e.name + "_wrapper" }, l))), s && (e.list = v(s.tag, p({ dest: [s.destination, s.position], id: s.id, role: "listbox", hidden: "hidden" }, s.class && { class: s.class }))), I(e), e.data.cache) return D(e).then(function(o) {
            try {
              return i.call(r);
            } catch (u) {
              return c(u);
            }
          }, c);
          function i() {
            return L("init", e), n();
          }
          return i.call(r);
        });
      }
      function M(e) {
        var r = e.prototype;
        r.init = function() {
          S(this);
        }, r.start = function(n) {
          G(this, n);
        }, r.unInit = function() {
          if (this.wrapper) {
            var n = this.wrapper.parentNode;
            n.insertBefore(this.input, this.wrapper), n.removeChild(this.wrapper);
          }
          var c;
          x((c = this).events, function(a, s) {
            c[a].removeEventListener(s, c.events[a][s]);
          });
        }, r.open = function() {
          Y(this);
        }, r.close = function() {
          g(this);
        }, r.goTo = function(n) {
          T(n, this);
        }, r.next = function() {
          z(this);
        }, r.previous = function() {
          $(this);
        }, r.select = function(n) {
          j(this, null, n);
        }, r.search = function(n, c, a) {
          return Z(n, c, a);
        };
      }
      return function e(r) {
        this.options = r, this.id = e.instances = (e.instances || 0) + 1, this.name = "autoComplete", this.wrapper = 1, this.threshold = 1, this.debounce = 0, this.resultsList = { position: "afterend", tag: "ul", maxResults: 5 }, this.resultItem = { tag: "li" }, function(n) {
          var c = n.name, a = n.options, s = n.resultsList, l = n.resultItem;
          for (var i in a) if (k(a[i]) === "object") for (var o in n[i] || (n[i] = {}), a[i]) n[i][o] = a[i][o];
          else n[i] = a[i];
          n.selector = n.selector || "#" + c, s.destination = s.destination || n.selector, s.id = s.id || c + "_list_" + n.id, l.id = l.id || c + "_result", n.input = P(n.selector);
        }(this), M.call(this, e), S(this);
      };
    }, f.exports = t();
  }(ee)), ee.exports;
}
var ie = le();
const ne = /* @__PURE__ */ ue(ie);
function oe(f, O, t) {
  var D, Q, F, B, q, U, Y;
  const w = document.createElement("div");
  w.className = "no-results no-results-concept-schemes", w.innerHTML = ((D = t == null ? void 0 : t.noResults) == null ? void 0 : D.concepts) || "No concept schemes found";
  const E = document.createElement("div");
  E.className = "error error-concept-schemes", E.innerHTML = ((Q = t == null ? void 0 : t.errorMessages) == null ? void 0 : Q.conceptSchemes) || "Error retrieving concept schemes";
  const C = document.createElement("input"), p = document.createElement("input"), b = document.createElement("div"), k = document.createElement("div"), A = document.createElement("div"), P = document.createElement("div");
  let v = null, N = null, R, L;
  return typeof (t == null ? void 0 : t.inputClasses) == "string" ? R = L = t == null ? void 0 : t.inputClasses : (R = ((F = t == null ? void 0 : t.inputClasses) == null ? void 0 : F.conceptScheme) || "", L = ((B = t == null ? void 0 : t.inputClasses) == null ? void 0 : B.concept) || ""), C.className = "concept-scheme-input " + R, p.className = "concept-input " + L, b.className = "no-results no-results-concepts", k.className = "loading loading-concept-schemes", k.innerHTML = ((q = t == null ? void 0 : t.loading) == null ? void 0 : q.conceptSchemes) || "Loading...", f.append(k), A.style.display = "none", A.className = "loading loading-concepts", A.innerHTML = ((U = t == null ? void 0 : t.loading) == null ? void 0 : U.concepts) || "Loading concepts...", P.style.display = "none", P.className = "error error-concepts", P.innerHTML = ((Y = t == null ? void 0 : t.errorMessages) == null ? void 0 : Y.concepts) || "Error retrieving concepts", ae(O).then((g) => {
    var G, x;
    if ((G = t == null ? void 0 : t.onConceptSchemesLoaded) == null || G.call(t, g), !g.length) {
      f.append(w);
      return;
    }
    b.style.display = "none", b.innerHTML = ((x = t == null ? void 0 : t.noResults) == null ? void 0 : x.concepts) || "No concepts found", p.style.display = "none", f.append(C), f.append(b), f.append(A), f.append(P), f.append(p);
    const T = (I) => I.toLowerCase(), z = (I, S) => {
      if (S.label.toLowerCase().includes(I))
        return S.label;
    }, $ = new ne({
      name: "rainbow-concept-schemes",
      selector: () => C,
      placeHolder: "Concept scheme",
      threshold: 0,
      data: {
        src: () => g
      },
      query: T,
      searchEngine: z,
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
            $.start();
          },
          async selection(I) {
            var M, e, r;
            const S = I.detail.selection.value;
            if (!(v && (S == null ? void 0 : S.uri) === v.uri) && (v = S, p.style.display = "none", p.value = "", b.style.display = "none", P.style.display = "none", v != null)) {
              C.value = v.label, (M = t == null ? void 0 : t.onConceptSchemeSelected) == null || M.call(t, v), A.style.display = "";
              try {
                N = await se(O, v.uri), (e = t == null ? void 0 : t.onConceptSchemeLoaded) == null || e.call(t, v, N), N.length ? (p.style.display = "", p.focus(), j.start()) : b.style.display = "";
              } catch (n) {
                P.style.display = "", (r = t == null ? void 0 : t.onError) == null || r.call(t, "loadConcepts", n);
              } finally {
                A.style.display = "none";
              }
            }
          }
        }
      }
    }), j = new ne({
      name: "rainbow-concepts",
      selector: () => p,
      placeHolder: "Concept",
      threshold: 0,
      data: {
        src: () => N || []
      },
      query: T,
      searchEngine: z,
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
            j.start();
          },
          selection(I) {
            var M;
            const S = I.detail.selection.value;
            p.value = S.label, (M = t == null ? void 0 : t.onConceptSelected) == null || M.call(t, S);
          }
        }
      }
    });
  }).catch((g) => {
    var T;
    f.append(E), (T = t == null ? void 0 : t.onError) == null || T.call(t, "loadConceptSchemes", g);
  }).finally(() => {
    f.removeChild(k);
  }), {
    reset: () => {
      var g, T;
      C.value = "", v = null, p.style.display = "none", p.value = "", b.style.display = "none", (g = t == null ? void 0 : t.onConceptSchemeSelected) == null || g.call(t, null), (T = t == null ? void 0 : t.onConceptSelected) == null || T.call(t, null);
    }
  };
}
export {
  oe as create
};
