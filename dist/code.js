(function() {
  "use strict";
  const DEFAULT = { enabled: true, preset: "black-soft", color: "#000000", opacity: 0.55, paddingX: 18, paddingY: 6, lineGap: 0, radius: 3, borderEnabled: false, borderColor: "#ffffff", borderOpacity: 0.5, borderWidth: 1 };
  const PRESETS = {
    "black-soft": { color: "#000000", opacity: 0.55, paddingX: 18, paddingY: 6, radius: 3, borderEnabled: false },
    "black-strong": { color: "#000000", opacity: 0.82, paddingX: 20, paddingY: 7, radius: 2, borderEnabled: false },
    "white-soft": { color: "#ffffff", opacity: 0.72, paddingX: 18, paddingY: 6, radius: 3, borderEnabled: false },
    "broadcast": { color: "#05080c", opacity: 0.88, paddingX: 22, paddingY: 7, radius: 1, borderEnabled: false }
  };
  const STORE = "zosmalabs-lyrics-background-config-v1";
  const SAVED_STORE = "zosmalabs-lyrics-background-saved-v1";
  const LAYOUT_KEYS = [
    "display",
    "width",
    "height",
    "left",
    "top",
    "transform",
    "white-space",
    "box-sizing",
    "background-color",
    "padding-left",
    "padding-right",
    "padding-top",
    "padding-bottom",
    "border-radius",
    "border-style",
    "border-width",
    "border-color",
    "box-decoration-break",
    "-webkit-box-decoration-break"
  ];
  let config = { ...DEFAULT };
  let target = null;
  let pluginStatus = "Iniciando";
  let timer;
  let busy = false;
  let lastSignature = "";
  const clamp = (v, min, max) => Math.min(max, Math.max(min, Number.isFinite(v) ? v : min));
  const validColor = (v) => typeof v === "string" && /^#[0-9a-f]{6}$/i.test(v);
  function rgba(hex, a) {
    const n = parseInt(hex.slice(1), 16);
    return "rgba(" + (n >> 16 & 255) + ", " + (n >> 8 & 255) + ", " + (n & 255) + ", " + clamp(a, 0, 1) + ")";
  }
  function safe(raw) {
    const r = raw && typeof raw === "object" ? raw : {};
    return {
      enabled: r.enabled === true,
      preset: typeof r.preset === "string" ? r.preset : "custom",
      color: validColor(r.color) ? r.color : DEFAULT.color,
      opacity: clamp(Number(r.opacity), 0, 1),
      paddingX: clamp(Number(r.paddingX), 0, 80),
      paddingY: clamp(Number(r.paddingY), 0, 40),
      lineGap: clamp(Number(r.lineGap), 0, 60),
      radius: clamp(Number(r.radius), 0, 50),
      borderEnabled: r.borderEnabled === true,
      borderColor: validColor(r.borderColor) ? r.borderColor : DEFAULT.borderColor,
      borderOpacity: clamp(Number(r.borderOpacity), 0, 1),
      borderWidth: clamp(Number(r.borderWidth), 0, 12)
    };
  }
  function escapeHtml(s) {
    return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
  }
  function escapeAttr(s) {
    return escapeHtml(s);
  }
  function lineHeight(t) {
    const raw = String(t.originalCss["line-height"] ?? "normal").trim();
    if (/^\d+(?:\.\d+)?$/.test(raw)) return "calc(" + raw + "em + " + config.lineGap + "px)";
    if (/^\d+(?:\.\d+)?(?:px|em|rem|%)$/.test(raw)) return "calc(" + raw + " + " + config.lineGap + "px)";
    return "calc(1.2em + " + config.lineGap + "px)";
  }
  function lineHtml(t) {
    const bg = rgba(config.color, config.opacity), bc = rgba(config.borderColor, config.borderOpacity);
    const border = config.borderEnabled ? config.borderWidth + "px solid " + bc : "none";
    const lineStyle = "display:inline;background:" + bg + ";padding:" + config.paddingY + "px " + config.paddingX + "px;border-radius:" + config.radius + "px;border:" + border + ";box-decoration-break:clone;-webkit-box-decoration-break:clone;";
    const lines = t.text.replace(/\r\n?/g, "\n").split("\n");
    const visualLineHeight = lineHeight(t);
    const content = lines.map((line) => {
      const rowStyle = "display:block;width:100%;margin:0;padding:0;border:0;background:transparent;line-height:" + visualLineHeight + ";text-align:inherit;";
      return '<span style="' + escapeAttr(rowStyle) + '"><span style="' + escapeAttr(lineStyle) + '">' + (line ? escapeHtml(line) : "&nbsp;") + "</span></span>";
    }).join("");
    return '<span data-lyrics-background="1" style="display:block;width:100%;background:transparent;margin:0;padding:0;border:0;line-height:' + escapeAttr(visualLineHeight) + ';">' + content + "</span>";
  }
  function originalLayout(t) {
    const neutral = {
      display: "flex",
      width: "80%",
      height: "80%",
      left: "10%",
      top: "10%",
      transform: "none",
      "white-space": "normal",
      "box-sizing": "content-box",
      "background-color": "transparent",
      "padding-left": "0px",
      "padding-right": "0px",
      "padding-top": "0px",
      "padding-bottom": "0px",
      "border-radius": "0px",
      "border-style": "none",
      "border-width": "0px",
      "border-color": "transparent",
      "box-decoration-break": "slice",
      "-webkit-box-decoration-break": "slice"
    };
    const css = {};
    for (const key of LAYOUT_KEYS) css[key] = t.originalCss[key] ?? neutral[key];
    if (css.display === "inline") css.display = "flex";
    if (css.width === "fit-content") css.width = "80%";
    if (css.height === "auto") css.height = "80%";
    if (css.left === "50%") css.left = "10%";
    if (css.top === "50%") css.top = "10%";
    if (css.transform === "translate(-50%, -50%)") css.transform = "none";
    css["background-color"] = "transparent";
    css["padding-left"] = "0px";
    css["padding-right"] = "0px";
    css["padding-top"] = "0px";
    css["padding-bottom"] = "0px";
    css["border-radius"] = "0px";
    css["border-style"] = "none";
    css["border-width"] = "0px";
    css["border-color"] = "transparent";
    css["box-decoration-break"] = "slice";
    css["-webkit-box-decoration-break"] = "slice";
    return css;
  }
  function post() {
    spresenter.ui.postMessage({ type: "state", config, target: target ? { title: target.title, theme: target.theme } : null, status: pluginStatus });
  }
  function elements(theme) {
    if (!theme || typeof theme !== "object") return [];
    const e = theme.elements;
    return Array.isArray(e) ? e.filter((x) => x && typeof x === "object") : [];
  }
  async function findTarget() {
    const outputs = await spresenter.outputs.list();
    for (const out of outputs) {
      const output = String(out.index), live = await spresenter.live.read(output);
      for (let layer = 0; layer < live.length; layer++) {
        const p = live[layer];
        if (p?.asset?.type !== "music") continue;
        const list = elements(p.theme).filter((e) => e.type === "TEXT" && typeof e.id === "string");
        const el = list.find((e) => typeof e.text === "string" && /\{letra\}/i.test(e.text)) ?? (list.length === 1 ? list[0] : null);
        if (!el) continue;
        const css = el.css && typeof el.css === "object" ? { ...el.css } : {};
        const props = p.props ?? {}, text = typeof props.text === "string" ? props.text : "";
        return {
          output,
          layer,
          elementId: String(el.id),
          title: p.asset.title ?? "Música",
          theme: String(p.theme?.title ?? ""),
          template: typeof el.text === "string" ? el.text : "{letra}",
          text,
          textAlign: String(css["text-align"] ?? "center"),
          originalCss: css
        };
      }
    }
    return null;
  }
  async function apply() {
    if (!target || busy) return;
    busy = true;
    try {
      const html = lineHtml(target), signature = target.output + "|" + target.layer + "|" + target.elementId + "|" + target.text + "|" + html;
      if (signature !== lastSignature) {
        await spresenter.live.setElement(target.output, target.layer, target.elementId, { css: originalLayout(target), html });
        lastSignature = signature;
      }
      pluginStatus = "Fundo por linha aplicado";
    } catch (e) {
      pluginStatus = "Falha ao aplicar: " + (e instanceof Error ? e.message : String(e));
    } finally {
      busy = false;
    }
  }
  async function restore() {
    if (!target) return;
    busy = true;
    try {
      await spresenter.live.setElement(target.output, target.layer, target.elementId, { css: originalLayout(target), html: "", text: target.template });
      lastSignature = "";
      pluginStatus = "Fundo desativado";
    } finally {
      busy = false;
    }
  }
  async function refresh() {
    if (busy) return;
    try {
      target = await findTarget();
      if (!target) {
        pluginStatus = "Nenhuma música ao vivo";
        post();
        return;
      }
      if (config.enabled) await apply();
      else pluginStatus = "Letra detectada";
      post();
    } catch (e) {
      pluginStatus = "Erro: " + (e instanceof Error ? e.message : String(e));
      post();
    }
  }
  async function update(raw) {
    const was = config.enabled;
    config = safe(raw);
    if (was && !config.enabled) await restore();
    else if (config.enabled) await refresh();
    post();
  }
  async function saveConfig() {
    try {
      const saved = { ...config, enabled: true };
      await spresenter.storage.set(SAVED_STORE, saved);
      await spresenter.storage.set(STORE, saved);
      spresenter.ui.postMessage({ type: "save-result", ok: true });
      pluginStatus = "Configuração salva";
      post();
    } catch (e) {
      const message = e instanceof Error ? e.message : String(e);
      spresenter.ui.postMessage({ type: "save-result", ok: false, message });
      pluginStatus = "Falha ao salvar: " + message;
      post();
    }
  }
  spresenter.ui.onmessage = async (raw) => {
    if (!raw || typeof raw !== "object") return;
    const m = raw;
    if (m.type === "init" || m.type === "refresh") {
      await refresh();
      return;
    }
    if (m.type === "config") {
      await update(m.config);
      return;
    }
    if (m.type === "save") {
      await saveConfig();
      return;
    }
    if (m.type === "preset" && m.preset && PRESETS[m.preset]) {
      await update({ ...config, ...PRESETS[m.preset], preset: m.preset });
    }
  };
  spresenter.on("live", () => {
    void refresh();
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => void refresh(), 32);
  });
  void Promise.all([spresenter.storage.get(SAVED_STORE), spresenter.storage.get(STORE)]).then(async ([saved, legacy]) => {
    config = { ...safe(saved ?? legacy), enabled: true };
    return refresh();
  }).catch((e) => {
    pluginStatus = String(e);
    post();
  });
})();
