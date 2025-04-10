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
}, K = {};
function ce(f, E, t = "POST") {
  return fetch(f, {
    method: t,
    body: E,
    headers: {
      Accept: "application/json",
      "Content-Type": "application/sparql-query"
    }
  });
}
async function ae(f) {
  var E, t;
  if (!K.hasOwnProperty(f)) {
    const w = await (await ce(f, te.FETCH_CONCEPT_SCHEMES)).json();
    (t = (E = w == null ? void 0 : w.results) == null ? void 0 : E.bindings) != null && t.length ? K[f] = w.results.bindings.map((g) => ({
      label: g.label.value,
      uri: g.cs.value,
      loading: !1,
      concepts: null
    })) : K[f] = [];
  }
  return K[f];
}
async function se(f, E) {
  var w, g;
  const t = await ae(f), C = t == null ? void 0 : t.find((p) => p.uri === E);
  if (!C)
    return [];
  if (C.concepts === null) {
    const v = await (await ce(
      f,
      te.FETCH_CONCEPT_SCHEME_CONCEPTS.replace("@@CS_URI@@", E)
    )).json();
    (g = (w = v == null ? void 0 : v.results) == null ? void 0 : w.bindings) != null && g.length && (C.concepts = v.results.bindings.map((L) => ({
      label: L.label.value,
      uri: L.c.value
    })));
  }
  return C.concepts || [];
}
function le(f) {
  return f && f.__esModule && Object.prototype.hasOwnProperty.call(f, "default") ? f.default : f;
}
var Z = { exports: {} }, re;
function ue() {
  return re || (re = 1, function(f, E) {
    var t;
    t = function() {
      function C(e, r) {
        (r == null || r > e.length) && (r = e.length);
        for (var n = 0, c = Array(r); n < r; n++) c[n] = e[n];
        return c;
      }
      function w(e, r, n) {
        return (r = function(c) {
          var a = function(s, u) {
            if (typeof s != "object" || !s) return s;
            var i = s[Symbol.toPrimitive];
            if (i !== void 0) {
              var o = i.call(s, u);
              if (typeof o != "object") return o;
              throw new TypeError("@@toPrimitive must return a primitive value.");
            }
            return (u === "string" ? String : Number)(s);
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
      function p(e) {
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
      function L(e) {
        return L = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(r) {
          return typeof r;
        } : function(r) {
          return r && typeof Symbol == "function" && r.constructor === Symbol && r !== Symbol.prototype ? "symbol" : typeof r;
        }, L(e);
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
      }, b = function(e, r) {
        var n = typeof e == "string" ? document.createElement(e) : e;
        for (var c in r) {
          var a = r[c];
          if (c === "inside") a.append(n);
          else if (c === "dest") A(a[0]).insertAdjacentElement(a[1], n);
          else if (c === "around") {
            var s = a;
            s.parentNode.insertBefore(n, s), n.append(s), s.getAttribute("autofocus") != null && s.focus();
          } else c in n ? n[c] = a : n.setAttribute(c, a);
        }
        return n;
      }, j = function(e, r) {
        return e = String(e).toLowerCase(), r ? e.normalize("NFD").replace(/[\u0300-\u036f]/g, "").normalize("NFC") : e;
      }, I = function(e, r) {
        return b("mark", p({ innerHTML: e }, typeof r == "string" && { class: r })).outerHTML;
      }, S = function(e, r) {
        r.input.dispatchEvent(new CustomEvent(e, { bubbles: !0, detail: r.feedback, cancelable: !0 }));
      }, R = function(e, r, n) {
        var c = n || {}, a = c.mode, s = c.diacritics, u = c.highlight, i = j(r, s);
        if (r = String(r), e = j(e, s), a === "loose") {
          var o = (e = e.replace(/ /g, "")).length, l = 0, d = Array.from(r).map(function(y, h) {
            return l < o && i[h] === e[l] && (y = u ? I(y, u) : y, l++), y;
          }).join("");
          if (l === o) return d;
        } else {
          var m = i.indexOf(e);
          if (~m) return e = r.substring(m, m + e.length), m = u ? r.replace(e, I(e, u)) : r;
        }
      }, V = function(e, r) {
        return new Promise(function(n, c) {
          var a;
          return (a = e.data).cache && a.store ? n() : new Promise(function(s, u) {
            return typeof a.src == "function" ? new Promise(function(i, o) {
              return a.src.constructor.name === "AsyncFunction" ? a.src(r).then(i, o) : i(a.src(r));
            }).then(s, u) : s(a.src);
          }).then(function(s) {
            try {
              return e.feedback = a.store = s, S("response", e), n();
            } catch (u) {
              return c(u);
            }
          }, c);
        });
      }, ee = function(e, r) {
        var n = r.data, c = r.searchEngine, a = [];
        n.store.forEach(function(u, i) {
          var o = function(m) {
            var y = m ? u[m] : u, h = typeof c == "function" ? c(e, y) : R(e, y, { mode: c, diacritics: r.diacritics, highlight: r.resultItem.highlight });
            if (h) {
              var _ = { match: h, value: u };
              m && (_.key = m), a.push(_);
            }
          };
          if (n.keys) {
            var l, d = function(m, y) {
              var h = typeof Symbol < "u" && m[Symbol.iterator] || m["@@iterator"];
              if (!h) {
                if (Array.isArray(m) || (h = k(m)) || y) {
                  h && (m = h);
                  var _ = 0, Q = function() {
                  };
                  return { s: Q, n: function() {
                    return _ >= m.length ? { done: !0 } : { done: !1, value: m[_++] };
                  }, e: function(H) {
                    throw H;
                  }, f: Q };
                }
                throw new TypeError(`Invalid attempt to iterate non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`);
              }
              var z, G = !0, $ = !1;
              return { s: function() {
                h = h.call(m);
              }, n: function() {
                var H = h.next();
                return G = H.done, H;
              }, e: function(H) {
                $ = !0, z = H;
              }, f: function() {
                try {
                  G || h.return == null || h.return();
                } finally {
                  if ($) throw z;
                }
              } };
            }(n.keys);
            try {
              for (d.s(); !(l = d.n()).done; ) o(l.value);
            } catch (m) {
              d.e(m);
            } finally {
              d.f();
            }
          } else o();
        }), n.filter && (a = n.filter(a));
        var s = a.slice(0, r.resultsList.maxResults);
        r.feedback = { query: e, matches: a, results: s }, S("results", r);
      }, F = "aria-expanded", B = "aria-activedescendant", q = "aria-selected", U = function(e, r) {
        e.feedback.selection = p({ index: r }, e.feedback.results[r]);
      }, J = function(e) {
        e.isOpen || ((e.wrapper || e.input).setAttribute(F, !0), e.list.removeAttribute("hidden"), e.isOpen = !0, S("open", e));
      }, N = function(e) {
        e.isOpen && ((e.wrapper || e.input).setAttribute(F, !1), e.input.setAttribute(B, ""), e.list.setAttribute("hidden", ""), e.isOpen = !1, S("close", e));
      }, x = function(e, r) {
        var n = r.resultItem, c = r.list.getElementsByTagName(n.tag), a = !!n.selected && n.selected.split(" ");
        if (r.isOpen && c.length) {
          var s, u, i = r.cursor;
          e >= c.length && (e = 0), e < 0 && (e = c.length - 1), r.cursor = e, i > -1 && (c[i].removeAttribute(q), a && (u = c[i].classList).remove.apply(u, v(a))), c[e].setAttribute(q, !0), a && (s = c[e].classList).add.apply(s, v(a)), r.input.setAttribute(B, c[r.cursor].id), r.list.scrollTop = c[e].offsetTop - r.list.clientHeight + c[e].clientHeight + 5, r.feedback.cursor = r.cursor, U(r, e), S("navigate", r);
        }
      }, O = function(e) {
        x(e.cursor + 1, e);
      }, T = function(e) {
        x(e.cursor - 1, e);
      }, M = function(e, r, n) {
        (n = n >= 0 ? n : e.cursor) < 0 || (e.feedback.event = r, U(e, n), S("selection", e), N(e));
      };
      function W(e, r) {
        var n = this;
        return new Promise(function(c, a) {
          var s, u;
          return s = r || ((u = e.input) instanceof HTMLInputElement || u instanceof HTMLTextAreaElement ? u.value : u.innerHTML), function(o, l, d) {
            return l ? l(o) : o.length >= d;
          }(s = e.query ? e.query(s) : s, e.trigger, e.threshold) ? V(e, s).then(function(o) {
            try {
              return e.feedback instanceof Error ? c() : (ee(s, e), e.resultsList && function(l) {
                var d = l.resultsList, m = l.list, y = l.resultItem, h = l.feedback, _ = h.matches, Q = h.results;
                if (l.cursor = -1, m.innerHTML = "", _.length || d.noResults) {
                  var z = new DocumentFragment();
                  Q.forEach(function(G, $) {
                    var H = b(y.tag, p({ id: "".concat(y.id, "_").concat($), role: "option", innerHTML: G.match, inside: z }, y.class && { class: y.class }));
                    y.element && y.element(H, G);
                  }), m.append(z), d.element && d.element(m, h), J(l);
                } else N(l);
              }(e), i.call(n));
            } catch (l) {
              return a(l);
            }
          }, a) : (N(e), i.call(n));
          function i() {
            return c();
          }
        });
      }
      var D = function(e, r) {
        for (var n in e) for (var c in e[n]) r(n, c);
      }, X = function(e) {
        var r, n, c, a = e.events, s = (r = function() {
          return W(e);
        }, n = e.debounce, function() {
          clearTimeout(c), c = setTimeout(function() {
            return r();
          }, n);
        }), u = e.events = p({ input: p({}, a && a.input) }, e.resultsList && { list: a ? p({}, a.list) : {} }), i = { input: { input: function() {
          s();
        }, keydown: function(o) {
          (function(l, d) {
            switch (l.keyCode) {
              case 40:
              case 38:
                l.preventDefault(), l.keyCode === 40 ? O(d) : T(d);
                break;
              case 13:
                d.submit || l.preventDefault(), d.cursor >= 0 && M(d, l);
                break;
              case 9:
                d.resultsList.tabSelect && d.cursor >= 0 && M(d, l);
                break;
              case 27:
                d.input.value = "", S("clear", d), N(d);
            }
          })(o, e);
        }, blur: function() {
          N(e);
        } }, list: { mousedown: function(o) {
          o.preventDefault();
        }, click: function(o) {
          (function(l, d) {
            var m = d.resultItem.tag.toUpperCase(), y = Array.from(d.list.querySelectorAll(m)), h = l.target.closest(m);
            h && h.nodeName === m && M(d, l, y.indexOf(h));
          })(o, e);
        } } };
        D(i, function(o, l) {
          (e.resultsList || l === "input") && (u[o][l] || (u[o][l] = i[o][l]));
        }), D(u, function(o, l) {
          e[o].addEventListener(l, u[o][l]);
        });
      };
      function Y(e) {
        var r = this;
        return new Promise(function(n, c) {
          var a, s, u;
          if (a = e.placeHolder, u = { role: "combobox", "aria-owns": (s = e.resultsList).id, "aria-haspopup": !0, "aria-expanded": !1 }, b(e.input, p(p({ "aria-controls": s.id, "aria-autocomplete": "both" }, a && { placeholder: a }), !e.wrapper && p({}, u))), e.wrapper && (e.wrapper = b("div", p({ around: e.input, class: e.name + "_wrapper" }, u))), s && (e.list = b(s.tag, p({ dest: [s.destination, s.position], id: s.id, role: "listbox", hidden: "hidden" }, s.class && { class: s.class }))), X(e), e.data.cache) return V(e).then(function(o) {
            try {
              return i.call(r);
            } catch (l) {
              return c(l);
            }
          }, c);
          function i() {
            return S("init", e), n();
          }
          return i.call(r);
        });
      }
      function P(e) {
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
          D((c = this).events, function(a, s) {
            c[a].removeEventListener(s, c.events[a][s]);
          });
        }, r.open = function() {
          J(this);
        }, r.close = function() {
          N(this);
        }, r.goTo = function(n) {
          x(n, this);
        }, r.next = function() {
          O(this);
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
          var c = n.name, a = n.options, s = n.resultsList, u = n.resultItem;
          for (var i in a) if (L(a[i]) === "object") for (var o in n[i] || (n[i] = {}), a[i]) n[i][o] = a[i][o];
          else n[i] = a[i];
          n.selector = n.selector || "#" + c, s.destination = s.destination || n.selector, s.id = s.id || c + "_list_" + n.id, u.id = u.id || c + "_result", n.input = A(n.selector);
        }(this), P.call(this, e), Y(this);
      };
    }, f.exports = t();
  }(Z)), Z.exports;
}
var ie = ue();
const ne = /* @__PURE__ */ le(ie);
function oe(f, E, t) {
  var F, B, q, U, J, N, x;
  const C = document.createElement("div");
  C.className = "no-results no-results-concept-schemes", C.innerHTML = ((F = t == null ? void 0 : t.noResults) == null ? void 0 : F.concepts) || "No concept schemes found";
  const w = document.createElement("div");
  w.className = "error error-concept-schemes", w.innerHTML = ((B = t == null ? void 0 : t.errorMessages) == null ? void 0 : B.conceptSchemes) || "Error retrieving concept schemes";
  const g = document.createElement("input"), p = document.createElement("input"), v = document.createElement("div"), L = document.createElement("div"), k = document.createElement("div"), A = document.createElement("div");
  let b = null, j = null, I = null, S, R;
  return typeof (t == null ? void 0 : t.inputClasses) == "string" ? S = R = t == null ? void 0 : t.inputClasses : (S = ((q = t == null ? void 0 : t.inputClasses) == null ? void 0 : q.conceptScheme) || "", R = ((U = t == null ? void 0 : t.inputClasses) == null ? void 0 : U.concept) || ""), g.className = "concept-scheme-input " + S, p.className = "concept-input " + R, v.className = "no-results no-results-concepts", L.className = "loading loading-concept-schemes", L.innerHTML = ((J = t == null ? void 0 : t.loading) == null ? void 0 : J.conceptSchemes) || "Loading...", f.append(L), k.style.display = "none", k.className = "loading loading-concepts", k.innerHTML = ((N = t == null ? void 0 : t.loading) == null ? void 0 : N.concepts) || "Loading concepts...", A.style.display = "none", A.className = "error error-concepts", A.innerHTML = ((x = t == null ? void 0 : t.errorMessages) == null ? void 0 : x.concepts) || "Error retrieving concepts", ae(E).then((O) => {
    var X, Y;
    if ((X = t == null ? void 0 : t.onConceptSchemesLoaded) == null || X.call(t, O), !O.length) {
      f.append(C);
      return;
    }
    v.style.display = "none", v.innerHTML = ((Y = t == null ? void 0 : t.noResults) == null ? void 0 : Y.concepts) || "No concepts found", p.style.display = "none", f.append(g), f.append(v), f.append(k), f.append(A), f.append(p);
    const T = (P) => P.toLowerCase(), M = (P, e) => {
      if (e.label.toLowerCase().includes(P))
        return e.label;
    }, W = new ne({
      name: "rainbow-concept-schemes",
      selector: () => g,
      placeHolder: "Concept scheme",
      threshold: 0,
      data: {
        src: () => O
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
          async selection(P) {
            var r, n, c;
            const e = P.detail.selection.value;
            if (!(b && (e == null ? void 0 : e.uri) === b.uri) && (b = e, p.style.display = "none", p.value = "", v.style.display = "none", A.style.display = "none", b != null)) {
              g.value = b.label, (r = t == null ? void 0 : t.onConceptSchemeSelected) == null || r.call(t, b), k.style.display = "";
              try {
                j = await se(E, b.uri), (n = t == null ? void 0 : t.onConceptSchemeLoaded) == null || n.call(t, b, j), j.length ? (p.style.display = "", p.focus(), D.start()) : v.style.display = "";
              } catch (a) {
                A.style.display = "", (c = t == null ? void 0 : t.onError) == null || c.call(t, "loadConcepts", a);
              } finally {
                k.style.display = "none";
              }
            }
          }
        }
      }
    }), D = new ne({
      name: "rainbow-concepts",
      selector: () => p,
      placeHolder: "Concept",
      threshold: 0,
      data: {
        src: () => j || []
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
            D.start();
          },
          selection(P) {
            var e;
            I = P.detail.selection.value, p.value = I.label, (e = t == null ? void 0 : t.onConceptSelected) == null || e.call(t, I);
          }
        }
      }
    });
  }).catch((O) => {
    var T;
    f.append(w), (T = t == null ? void 0 : t.onError) == null || T.call(t, "loadConceptSchemes", O);
  }).finally(() => {
    f.removeChild(L);
  }), {
    reset: () => {
      var O, T;
      g.value = "", b = null, p.style.display = "none", p.value = "", v.style.display = "none", (O = t == null ? void 0 : t.onConceptSchemeSelected) == null || O.call(t, null), (T = t == null ? void 0 : t.onConceptSelected) == null || T.call(t, null);
    },
    getSelection: () => ({
      conceptScheme: b ? JSON.parse(JSON.stringify(b)) : null,
      concept: I ? JSON.parse(JSON.stringify(I)) : null
    })
  };
}
export {
  oe as create
};
