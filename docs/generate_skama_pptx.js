/**
 * Genera docs/presentacion-skama-capas.pptx
 * Uso: node generate_skama_pptx.js
 */
const PptxGenJS = require("pptxgenjs");
const path = require("path");

const COLORS = {
  bg: "F7F5F2",
  surface: "FFFFFF",
  ink: "1C2430",
  muted: "5B6573",
  accent: "0F6E56",
  accentSoft: "D8F3E7",
  accentDark: "0A4F3D",
  line: "D9D3C9",
  codeBg: "1C2430",
  codeFg: "E8F0EC",
  warn: "8A5A00",
  warnSoft: "FFF3D6",
  sectionDb: "0F6E56",
  sectionApi: "1F4E79",
  sectionFe: "7A3E12",
  sectionDemo: "4A5568",
  white: "FFFFFF",
  boxA: "E8F3EF",
  boxB: "E6EEF6",
  boxC: "F6EADF",
  boxD: "EEE9E2",
};

function addBg(slide) {
  slide.addShape("rect", {
    x: 0,
    y: 0,
    w: "100%",
    h: "100%",
    fill: { color: COLORS.bg },
    line: { color: COLORS.bg },
  });
}

function addFooter(slide, page, total) {
  slide.addText("SKAMA · Arquitectura en capas", {
    x: 0.5,
    y: 7.15,
    w: 8,
    h: 0.3,
    fontSize: 10,
    color: COLORS.muted,
    fontFace: "Calibri",
  });
  slide.addText(`${page} / ${total}`, {
    x: 11.2,
    y: 7.15,
    w: 1.3,
    h: 0.3,
    fontSize: 10,
    color: COLORS.muted,
    fontFace: "Calibri",
    align: "right",
  });
}

function addAccentBar(slide, color = COLORS.accent) {
  slide.addShape("rect", {
    x: 0,
    y: 0,
    w: 0.12,
    h: "100%",
    fill: { color },
    line: { color },
  });
}

function titleSlide(pptx, total) {
  const slide = pptx.addSlide();
  addBg(slide);
  slide.addShape("rect", {
    x: 0,
    y: 0,
    w: "100%",
    h: "100%",
    fill: { color: COLORS.accentDark },
    line: { color: COLORS.accentDark },
  });
  slide.addShape("rect", {
    x: 0,
    y: 5.6,
    w: "100%",
    h: 1.9,
    fill: { color: COLORS.accent },
    line: { color: COLORS.accent },
  });
  slide.addText("SKAMA", {
    x: 0.8,
    y: 2.0,
    w: 11,
    h: 1,
    fontSize: 54,
    bold: true,
    color: COLORS.white,
    fontFace: "Georgia",
  });
  slide.addText("Arquitectura en capas", {
    x: 0.8,
    y: 3.0,
    w: 11,
    h: 0.6,
    fontSize: 28,
    color: COLORS.accentSoft,
    fontFace: "Calibri",
  });
  slide.addText(
    "Base de datos · API · Frontend\nDiagramas y pseudocódigo para explicar el sistema en clase",
    {
      x: 0.8,
      y: 5.85,
      w: 11,
      h: 0.9,
      fontSize: 16,
      color: COLORS.white,
      fontFace: "Calibri",
    }
  );
  slide.addNotes("Portada. Presentar el objetivo: entender cómo viaja la información entre capas.");
}

function agendaSlide(pptx, page, total) {
  const slide = pptx.addSlide();
  addBg(slide);
  addAccentBar(slide);
  addFooter(slide, page, total);
  slide.addText("Agenda", {
    x: 0.6,
    y: 0.4,
    w: 10,
    h: 0.6,
    fontSize: 32,
    bold: true,
    color: COLORS.ink,
    fontFace: "Georgia",
  });

  const items = [
    { n: "01", t: "Base de datos", d: "Estándares, relaciones, 3FN y stored procedures" },
    { n: "02", t: "API", d: "Controllers, Services, Repositories, Models y DTOs" },
    { n: "03", t: "Frontend", d: "Servicios, providers, componentes reutilizables" },
    { n: "04", t: "Demo en vivo", d: "Del clic en pantalla hasta SQL Server" },
  ];

  items.forEach((item, i) => {
    const y = 1.3 + i * 1.25;
    slide.addShape("roundRect", {
      x: 0.6,
      y,
      w: 12,
      h: 1.05,
      fill: { color: COLORS.surface },
      line: { color: COLORS.line },
      rectRadius: 0.08,
    });
    slide.addText(item.n, {
      x: 0.85,
      y: y + 0.2,
      w: 1.2,
      h: 0.65,
      fontSize: 28,
      bold: true,
      color: COLORS.accent,
      fontFace: "Georgia",
    });
    slide.addText(item.t, {
      x: 2.2,
      y: y + 0.18,
      w: 9.5,
      h: 0.4,
      fontSize: 20,
      bold: true,
      color: COLORS.ink,
      fontFace: "Calibri",
    });
    slide.addText(item.d, {
      x: 2.2,
      y: y + 0.55,
      w: 9.5,
      h: 0.35,
      fontSize: 14,
      color: COLORS.muted,
      fontFace: "Calibri",
    });
  });
}

function sectionSlide(pptx, title, subtitle, color, page, total) {
  const slide = pptx.addSlide();
  slide.addShape("rect", {
    x: 0,
    y: 0,
    w: "100%",
    h: "100%",
    fill: { color },
    line: { color },
  });
  slide.addText(title, {
    x: 0.8,
    y: 2.7,
    w: 11.5,
    h: 0.8,
    fontSize: 40,
    bold: true,
    color: COLORS.white,
    fontFace: "Georgia",
  });
  slide.addText(subtitle, {
    x: 0.8,
    y: 3.6,
    w: 11.5,
    h: 0.5,
    fontSize: 18,
    color: "E8F0EC",
    fontFace: "Calibri",
  });
  slide.addText(`${page} / ${total}`, {
    x: 11.2,
    y: 7.15,
    w: 1.3,
    h: 0.3,
    fontSize: 10,
    color: "D0D8D4",
    align: "right",
    fontFace: "Calibri",
  });
}

function monorepoSlide(pptx, page, total) {
  const slide = pptx.addSlide();
  addBg(slide);
  addAccentBar(slide);
  addFooter(slide, page, total);
  slide.addText("Vista del monorepo", {
    x: 0.6,
    y: 0.35,
    w: 12,
    h: 0.55,
    fontSize: 30,
    bold: true,
    color: COLORS.ink,
    fontFace: "Georgia",
  });
  slide.addText("Tres proyectos, una misma historia de negocio", {
    x: 0.6,
    y: 0.95,
    w: 12,
    h: 0.35,
    fontSize: 15,
    color: COLORS.muted,
    fontFace: "Calibri",
  });

  const boxes = [
    {
      x: 0.6,
      title: "skama-db",
      role: "Datos",
      lines: ["Tablas y relaciones", "Stored procedures", "Seeds / ResultCode", "SQL Server"],
      fill: COLORS.boxA,
      accent: COLORS.sectionDb,
    },
    {
      x: 4.55,
      title: "skama-api",
      role: "Backend",
      lines: ["Controllers", "Services", "Repositories + Dapper", "Models / DTOs"],
      fill: COLORS.boxB,
      accent: COLORS.sectionApi,
    },
    {
      x: 8.5,
      title: "skama-webapp",
      role: "Frontend",
      lines: ["React + Vite", "Services Axios", "Providers / hooks", "Componentes UI"],
      fill: COLORS.boxC,
      accent: COLORS.sectionFe,
    },
  ];

  boxes.forEach((b) => {
    slide.addShape("roundRect", {
      x: b.x,
      y: 1.55,
      w: 3.6,
      h: 4.8,
      fill: { color: COLORS.surface },
      line: { color: COLORS.line },
      rectRadius: 0.1,
    });
    slide.addShape("rect", {
      x: b.x,
      y: 1.55,
      w: 3.6,
      h: 0.18,
      fill: { color: b.accent },
      line: { color: b.accent },
    });
    slide.addText(b.role, {
      x: b.x + 0.25,
      y: 1.95,
      w: 3.1,
      h: 0.3,
      fontSize: 12,
      color: b.accent,
      bold: true,
      fontFace: "Calibri",
    });
    slide.addText(b.title, {
      x: b.x + 0.25,
      y: 2.3,
      w: 3.1,
      h: 0.5,
      fontSize: 22,
      bold: true,
      color: COLORS.ink,
      fontFace: "Georgia",
    });
    b.lines.forEach((line, i) => {
      slide.addText("•  " + line, {
        x: b.x + 0.25,
        y: 3.1 + i * 0.55,
        w: 3.1,
        h: 0.4,
        fontSize: 15,
        color: COLORS.ink,
        fontFace: "Calibri",
      });
    });
  });
}

function whySpSlide(pptx, page, total) {
  const slide = pptx.addSlide();
  addBg(slide);
  addAccentBar(slide, COLORS.sectionDb);
  addFooter(slide, page, total);
  slide.addText("¿Por qué SQL Server + Stored Procedures?", {
    x: 0.6,
    y: 0.35,
    w: 12,
    h: 0.6,
    fontSize: 28,
    bold: true,
    color: COLORS.ink,
    fontFace: "Georgia",
  });

  const cards = [
    {
      t: "Reglas cerca de los datos",
      d: "Validaciones de stock, carrito activo y checkout viven en el SP.",
    },
    {
      t: "Contrato estable",
      d: "La API llama por nombre (usp_...) sin armar SQL dinámico en C#.",
    },
    {
      t: "Transacciones",
      d: "Checkout: crear orden, bajar stock y cerrar carrito en una sola unidad.",
    },
    {
      t: "Códigos de resultado",
      d: "ResultCode comunica éxito o error de negocio sin excepciones ruidosas.",
    },
  ];

  cards.forEach((c, i) => {
    const col = i % 2;
    const row = Math.floor(i / 2);
    const x = 0.6 + col * 6.2;
    const y = 1.3 + row * 2.5;
    slide.addShape("roundRect", {
      x,
      y,
      w: 5.9,
      h: 2.2,
      fill: { color: COLORS.surface },
      line: { color: COLORS.line },
      rectRadius: 0.1,
    });
    slide.addShape("ellipse", {
      x: x + 0.3,
      y: y + 0.35,
      w: 0.35,
      h: 0.35,
      fill: { color: COLORS.accent },
      line: { color: COLORS.accent },
    });
    slide.addText(c.t, {
      x: x + 0.85,
      y: y + 0.3,
      w: 4.7,
      h: 0.45,
      fontSize: 18,
      bold: true,
      color: COLORS.ink,
      fontFace: "Calibri",
    });
    slide.addText(c.d, {
      x: x + 0.3,
      y: y + 1.0,
      w: 5.3,
      h: 0.9,
      fontSize: 15,
      color: COLORS.muted,
      fontFace: "Calibri",
    });
  });
}

function namingSlide(pptx, page, total) {
  const slide = pptx.addSlide();
  addBg(slide);
  addAccentBar(slide, COLORS.sectionDb);
  addFooter(slide, page, total);
  slide.addText("Estándares de nombres", {
    x: 0.6,
    y: 0.35,
    w: 12,
    h: 0.55,
    fontSize: 30,
    bold: true,
    color: COLORS.ink,
    fontFace: "Georgia",
  });
  slide.addText("Una convención clara evita ambigüedad entre capas", {
    x: 0.6,
    y: 0.95,
    w: 12,
    h: 0.35,
    fontSize: 15,
    color: COLORS.muted,
    fontFace: "Calibri",
  });

  const prefixes = [
    ["TID_", "Identificadores / FK", "TID_ProductId"],
    ["TC_", "Texto / códigos", "TC_Name, TC_Status"],
    ["TN_", "Numéricos", "TN_Price, TN_Quantity"],
    ["TB_", "Booleanos", "TB_IsActive"],
    ["TD_", "Fechas", "TD_CreatedAt"],
  ];

  prefixes.forEach((p, i) => {
    const y = 1.5 + i * 0.72;
    slide.addShape("roundRect", {
      x: 0.6,
      y,
      w: 7.6,
      h: 0.62,
      fill: { color: COLORS.surface },
      line: { color: COLORS.line },
      rectRadius: 0.06,
    });
    slide.addText(p[0], {
      x: 0.8,
      y: y + 0.12,
      w: 1.4,
      h: 0.4,
      fontSize: 16,
      bold: true,
      color: COLORS.accent,
      fontFace: "Consolas",
    });
    slide.addText(p[1], {
      x: 2.3,
      y: y + 0.12,
      w: 2.8,
      h: 0.4,
      fontSize: 14,
      color: COLORS.ink,
      fontFace: "Calibri",
    });
    slide.addText(p[2], {
      x: 5.2,
      y: y + 0.12,
      w: 2.8,
      h: 0.4,
      fontSize: 13,
      color: COLORS.muted,
      fontFace: "Consolas",
    });
  });

  slide.addShape("roundRect", {
    x: 8.5,
    y: 1.5,
    w: 4.3,
    h: 4.7,
    fill: { color: COLORS.codeBg },
    line: { color: COLORS.codeBg },
    rectRadius: 0.1,
  });
  slide.addText("Stored procedures", {
    x: 8.75,
    y: 1.75,
    w: 3.8,
    h: 0.4,
    fontSize: 14,
    bold: true,
    color: COLORS.accentSoft,
    fontFace: "Calibri",
  });
  slide.addText(
    "usp_<Entidad>_<Accion>\n\nusp_CartItem_Add\nusp_Order_CreateFromCart\nusp_Product_GetAll\nusp_User_Register\n\nCarpetas por dominio:\ncarts / orders / products\nusers / reports …",
    {
      x: 8.75,
      y: 2.3,
      w: 3.8,
      h: 3.5,
      fontSize: 14,
      color: COLORS.codeFg,
      fontFace: "Consolas",
    }
  );
}

function erSlide(pptx, page, total) {
  const slide = pptx.addSlide();
  addBg(slide);
  addAccentBar(slide, COLORS.sectionDb);
  addFooter(slide, page, total);
  slide.addText("Diagrama ER simplificado", {
    x: 0.6,
    y: 0.3,
    w: 12,
    h: 0.5,
    fontSize: 28,
    bold: true,
    color: COLORS.ink,
    fontFace: "Georgia",
  });
  slide.addText("Núcleo del comercio: catálogo, carrito y pedido", {
    x: 0.6,
    y: 0.8,
    w: 12,
    h: 0.3,
    fontSize: 14,
    color: COLORS.muted,
    fontFace: "Calibri",
  });

  const entities = [
    { x: 0.5, y: 1.4, label: "Category", sub: "1 → N" },
    { x: 3.3, y: 1.4, label: "Product", sub: "catálogo" },
    { x: 6.1, y: 1.4, label: "User", sub: "[User]" },
    { x: 8.9, y: 1.4, label: "Cart", sub: "ACTIVE" },
    { x: 1.9, y: 3.5, label: "CartItem", sub: "línea carrito" },
    { x: 4.7, y: 3.5, label: "Order", sub: "[Order]" },
    { x: 7.5, y: 3.5, label: "OrderItem", sub: "snapshot" },
    { x: 10.3, y: 3.5, label: "Promotion\nProduct", sub: "N ↔ N" },
  ];

  entities.forEach((e) => {
    slide.addShape("roundRect", {
      x: e.x,
      y: e.y,
      w: 2.4,
      h: 1.15,
      fill: { color: COLORS.surface },
      line: { color: COLORS.accent, width: 1.5 },
      rectRadius: 0.08,
    });
    slide.addText(e.label, {
      x: e.x + 0.1,
      y: e.y + 0.2,
      w: 2.2,
      h: 0.55,
      fontSize: 14,
      bold: true,
      color: COLORS.ink,
      align: "center",
      fontFace: "Calibri",
      valign: "middle",
    });
    slide.addText(e.sub, {
      x: e.x + 0.1,
      y: e.y + 0.75,
      w: 2.2,
      h: 0.28,
      fontSize: 11,
      color: COLORS.muted,
      align: "center",
      fontFace: "Calibri",
    });
  });

  slide.addShape("roundRect", {
    x: 0.5,
    y: 5.1,
    w: 12.2,
    h: 1.7,
    fill: { color: COLORS.accentSoft },
    line: { color: COLORS.accentSoft },
    rectRadius: 0.08,
  });
  slide.addText("Relaciones clave", {
    x: 0.75,
    y: 5.25,
    w: 11.5,
    h: 0.35,
    fontSize: 14,
    bold: true,
    color: COLORS.accentDark,
    fontFace: "Calibri",
  });
  slide.addText(
    "Category → Product → CartItem ← Cart ← User\nUser → Order → OrderItem ← Product (con nombre y precio históricos)\nPromotion ↔ Product mediante PromotionProduct",
    {
      x: 0.75,
      y: 5.65,
      w: 11.5,
      h: 1.0,
      fontSize: 14,
      color: COLORS.ink,
      fontFace: "Calibri",
    }
  );
}

function n3Slide(pptx, page, total) {
  const slide = pptx.addSlide();
  addBg(slide);
  addAccentBar(slide, COLORS.sectionDb);
  addFooter(slide, page, total);
  slide.addText("3FN en la práctica", {
    x: 0.6,
    y: 0.35,
    w: 12,
    h: 0.55,
    fontSize: 30,
    bold: true,
    color: COLORS.ink,
    fontFace: "Georgia",
  });

  slide.addShape("roundRect", {
    x: 0.6,
    y: 1.2,
    w: 6.0,
    h: 5.2,
    fill: { color: COLORS.surface },
    line: { color: COLORS.line },
    rectRadius: 0.1,
  });
  slide.addText("Normalizado", {
    x: 0.9,
    y: 1.45,
    w: 5.4,
    h: 0.4,
    fontSize: 18,
    bold: true,
    color: COLORS.accent,
    fontFace: "Calibri",
  });
  const norms = [
    "Role, User, CustomerProfile separados",
    "Category independiente de Product",
    "CartItem / OrderItem como tablas hijas",
    "PromotionProduct resuelve N↔N",
    "Unicidad: un producto por carrito",
    "Inventario y reviews en tablas propias",
  ];
  norms.forEach((t, i) => {
    slide.addText("▸  " + t, {
      x: 0.95,
      y: 2.1 + i * 0.6,
      w: 5.3,
      h: 0.5,
      fontSize: 15,
      color: COLORS.ink,
      fontFace: "Calibri",
    });
  });

  slide.addShape("roundRect", {
    x: 6.9,
    y: 1.2,
    w: 5.7,
    h: 5.2,
    fill: { color: COLORS.warnSoft },
    line: { color: "E8D5A8" },
    rectRadius: 0.1,
  });
  slide.addText("Excepción intencional", {
    x: 7.2,
    y: 1.45,
    w: 5.2,
    h: 0.4,
    fontSize: 18,
    bold: true,
    color: COLORS.warn,
    fontFace: "Calibri",
  });
  slide.addText(
    "OrderItem guarda:\n• TC_ProductName\n• TN_UnitPrice\n\n¿Por qué?\nPorque el pedido es un\nhistorial: si el producto\ncambia de nombre o precio\nmás tarde, la factura\ndebe conservar lo comprado.\n\nNo es un error de modelado:\nes denormalización a propósito.",
    {
      x: 7.2,
      y: 2.05,
      w: 5.1,
      h: 4.0,
      fontSize: 15,
      color: COLORS.ink,
      fontFace: "Calibri",
    }
  );
}

function addCodeBlock(slide, x, y, w, h, title, code) {
  slide.addShape("roundRect", {
    x,
    y,
    w,
    h,
    fill: { color: COLORS.codeBg },
    line: { color: COLORS.codeBg },
    rectRadius: 0.1,
  });
  if (title) {
    slide.addText(title, {
      x: x + 0.25,
      y: y + 0.15,
      w: w - 0.5,
      h: 0.35,
      fontSize: 12,
      bold: true,
      color: COLORS.accentSoft,
      fontFace: "Calibri",
    });
  }
  slide.addText(code, {
    x: x + 0.25,
    y: y + (title ? 0.55 : 0.25),
    w: w - 0.5,
    h: h - (title ? 0.75 : 0.4),
    fontSize: 13,
    color: COLORS.codeFg,
    fontFace: "Consolas",
    valign: "top",
  });
}

function spCartSlide(pptx, page, total) {
  const slide = pptx.addSlide();
  addBg(slide);
  addAccentBar(slide, COLORS.sectionDb);
  addFooter(slide, page, total);
  slide.addText("Pseudocódigo: usp_CartItem_Add", {
    x: 0.6,
    y: 0.3,
    w: 12,
    h: 0.5,
    fontSize: 26,
    bold: true,
    color: COLORS.ink,
    fontFace: "Georgia",
  });

  addCodeBlock(
    slide,
    0.5,
    1.0,
    7.8,
    5.8,
    "Stored procedure (lógica de negocio)",
    `PROCEDIMIENTO AgregarItemCarrito\n  (cartId, productId, quantity)\n  SALIDA: cartItemId, resultCode\n\nSI quantity <= 0 → resultCode = 2; SALIR\nSI carrito no ACTIVE → 31; SALIR\nSI producto inexistente/inactivo → 20; SALIR\n\ntotal = cantidadExistente + quantity\nSI total > stock → 22; SALIR\n\nSI ya existe la línea:\n  ACTUALIZAR cantidad y precio\nSI NO:\n  INSERTAR nueva línea\n\nACTUALIZAR fecha del carrito\nresultCode = 0  // éxito`
  );

  slide.addShape("roundRect", {
    x: 8.55,
    y: 1.0,
    w: 4.2,
    h: 5.8,
    fill: { color: COLORS.surface },
    line: { color: COLORS.line },
    rectRadius: 0.1,
  });
  slide.addText("ResultCode", {
    x: 8.85,
    y: 1.25,
    w: 3.7,
    h: 0.4,
    fontSize: 16,
    bold: true,
    color: COLORS.ink,
    fontFace: "Calibri",
  });
  const codes = [
    ["0", "Éxito"],
    ["2", "Cantidad inválida"],
    ["20", "Producto no activo"],
    ["22", "Stock insuficiente"],
    ["31", "Carrito no activo"],
  ];
  codes.forEach((c, i) => {
    const y = 1.9 + i * 0.8;
    slide.addText(c[0], {
      x: 8.85,
      y,
      w: 0.8,
      h: 0.4,
      fontSize: 18,
      bold: true,
      color: COLORS.accent,
      fontFace: "Consolas",
    });
    slide.addText(c[1], {
      x: 9.7,
      y,
      w: 2.7,
      h: 0.4,
      fontSize: 14,
      color: COLORS.ink,
      fontFace: "Calibri",
    });
  });
}

function spOrderSlide(pptx, page, total) {
  const slide = pptx.addSlide();
  addBg(slide);
  addAccentBar(slide, COLORS.sectionDb);
  addFooter(slide, page, total);
  slide.addText("Pseudocódigo: usp_Order_CreateFromCart", {
    x: 0.6,
    y: 0.3,
    w: 12,
    h: 0.5,
    fontSize: 26,
    bold: true,
    color: COLORS.ink,
    fontFace: "Georgia",
  });
  slide.addText("Una transacción: todo o nada", {
    x: 0.6,
    y: 0.85,
    w: 12,
    h: 0.3,
    fontSize: 14,
    color: COLORS.muted,
    fontFace: "Calibri",
  });

  addCodeBlock(
    slide,
    0.5,
    1.3,
    12.3,
    5.5,
    "Checkout transaccional",
    `INICIAR TRANSACCIÓN\n  Validar carrito ACTIVE y con ítems\n  Validar stock de cada producto\n  INSERTAR Order  (totales, dirección, método de pago)\n  POR CADA ítem del carrito:\n      INSERTAR OrderItem  (nombre + precio snapshot)\n      DECREMENTAR stock del Product\n  MARCAR Cart como CHECKED_OUT\n  resultCode = 0\nCONFIRMAR TRANSACCIÓN\n\nSI falla cualquier paso → REVERTIR (ROLLBACK)`
  );
}

function apiLayersSlide(pptx, page, total) {
  const slide = pptx.addSlide();
  addBg(slide);
  addAccentBar(slide, COLORS.sectionApi);
  addFooter(slide, page, total);
  slide.addText("Capas de la API (ASP.NET)", {
    x: 0.6,
    y: 0.3,
    w: 12,
    h: 0.5,
    fontSize: 28,
    bold: true,
    color: COLORS.ink,
    fontFace: "Georgia",
  });

  const layers = [
    { t: "Controller", d: "HTTP: rutas, status codes, ProblemDetails", c: "1F4E79" },
    { t: "Service", d: "Reglas de aplicación y mensajes al cliente", c: "2E6B9E" },
    { t: "Repository", d: "Dapper + llamadas a stored procedures", c: "3D87B8" },
    { t: "SQL / SP", d: "Persistencia y reglas duras de negocio", c: "0F6E56" },
  ];

  layers.forEach((l, i) => {
    const y = 1.15 + i * 1.3;
    slide.addShape("roundRect", {
      x: 2.2,
      y,
      w: 9,
      h: 1.1,
      fill: { color: l.c },
      line: { color: l.c },
      rectRadius: 0.08,
    });
    slide.addText(l.t, {
      x: 2.5,
      y: y + 0.15,
      w: 8.4,
      h: 0.4,
      fontSize: 20,
      bold: true,
      color: COLORS.white,
      fontFace: "Calibri",
    });
    slide.addText(l.d, {
      x: 2.5,
      y: y + 0.55,
      w: 8.4,
      h: 0.35,
      fontSize: 14,
      color: "DCE8F2",
      fontFace: "Calibri",
    });
    if (i < layers.length - 1) {
      slide.addText("▼", {
        x: 6.3,
        y: y + 1.0,
        w: 0.8,
        h: 0.3,
        fontSize: 14,
        color: COLORS.muted,
        align: "center",
      });
    }
  });
}

function apiRolesSlide(pptx, page, total) {
  const slide = pptx.addSlide();
  addBg(slide);
  addAccentBar(slide, COLORS.sectionApi);
  addFooter(slide, page, total);
  slide.addText("¿Qué hace cada capa?", {
    x: 0.6,
    y: 0.3,
    w: 12,
    h: 0.5,
    fontSize: 28,
    bold: true,
    color: COLORS.ink,
    fontFace: "Georgia",
  });

  const rows = [
    ["Capa", "Responsabilidad", "Ejemplo SKAMA"],
    ["Controller", "Entrada HTTP y respuesta", "CartController.AddItem"],
    ["Service", "Orquestar + mapear errores", "CartService → mensajes ES"],
    ["Repository", "Hablar con la BD", "ExecuteAsync usp_CartItem_Add"],
    ["Model", "Forma de datos persistidos", "Cart, Product, Order"],
    ["DTO", "Contrato público de la API", "AddCartItemRequest, CartDetailDto"],
  ];

  rows.forEach((r, i) => {
    const y = 1.1 + i * 0.85;
    const bg = i === 0 ? COLORS.sectionApi : i % 2 === 0 ? COLORS.boxB : COLORS.surface;
    const fg = i === 0 ? COLORS.white : COLORS.ink;
    slide.addShape("rect", {
      x: 0.5,
      y,
      w: 12.3,
      h: 0.75,
      fill: { color: bg },
      line: { color: i === 0 ? COLORS.sectionApi : COLORS.line },
    });
    slide.addText(r[0], {
      x: 0.7,
      y: y + 0.18,
      w: 2.4,
      h: 0.4,
      fontSize: 14,
      bold: true,
      color: fg,
      fontFace: "Calibri",
    });
    slide.addText(r[1], {
      x: 3.3,
      y: y + 0.18,
      w: 4.5,
      h: 0.4,
      fontSize: 14,
      color: fg,
      fontFace: "Calibri",
    });
    slide.addText(r[2], {
      x: 8.0,
      y: y + 0.18,
      w: 4.5,
      h: 0.4,
      fontSize: 13,
      color: i === 0 ? COLORS.white : COLORS.muted,
      fontFace: "Consolas",
    });
  });
}

function dtoSlide(pptx, page, total) {
  const slide = pptx.addSlide();
  addBg(slide);
  addAccentBar(slide, COLORS.sectionApi);
  addFooter(slide, page, total);
  slide.addText("Models vs DTOs", {
    x: 0.6,
    y: 0.3,
    w: 12,
    h: 0.5,
    fontSize: 28,
    bold: true,
    color: COLORS.ink,
    fontFace: "Georgia",
  });
  slide.addText("No exponemos la tabla cruda: adaptamos para cada frontera", {
    x: 0.6,
    y: 0.85,
    w: 12,
    h: 0.35,
    fontSize: 14,
    color: COLORS.muted,
    fontFace: "Calibri",
  });

  slide.addShape("roundRect", {
    x: 0.5,
    y: 1.45,
    w: 5.9,
    h: 5.0,
    fill: { color: COLORS.surface },
    line: { color: COLORS.line },
    rectRadius: 0.1,
  });
  slide.addText("Model (interno)", {
    x: 0.8,
    y: 1.7,
    w: 5.3,
    h: 0.4,
    fontSize: 18,
    bold: true,
    color: COLORS.sectionApi,
    fontFace: "Calibri",
  });
  slide.addText(
    "Product\n• Id, CategoryId\n• Name, Price, Stock\n• IsActive, CreatedAt…\n\nRefleja lo que viene\ndel stored procedure /\nconsulta de persistencia.",
    {
      x: 0.8,
      y: 2.3,
      w: 5.3,
      h: 3.8,
      fontSize: 16,
      color: COLORS.ink,
      fontFace: "Calibri",
    }
  );

  slide.addShape("roundRect", {
    x: 6.8,
    y: 1.45,
    w: 5.9,
    h: 5.0,
    fill: { color: COLORS.surface },
    line: { color: COLORS.line },
    rectRadius: 0.1,
  });
  slide.addText("DTO (contrato API)", {
    x: 7.1,
    y: 1.7,
    w: 5.3,
    h: 0.4,
    fontSize: 18,
    bold: true,
    color: COLORS.accent,
    fontFace: "Calibri",
  });
  slide.addText(
    "ProductDto\n• + CategoryName\n• forma lista para UI\n\nCreateProductRequest\n• [Required], [Range]\n• validación de entrada\n\nEl Service convierte\nRequest → Model → Dto.",
    {
      x: 7.1,
      y: 2.3,
      w: 5.3,
      h: 3.8,
      fontSize: 16,
      color: COLORS.ink,
      fontFace: "Calibri",
    }
  );
}

function apiFlowSlide(pptx, page, total) {
  const slide = pptx.addSlide();
  addBg(slide);
  addAccentBar(slide, COLORS.sectionApi);
  addFooter(slide, page, total);
  slide.addText("Flujo: POST /api/cart/{cartId}/items", {
    x: 0.6,
    y: 0.25,
    w: 12,
    h: 0.45,
    fontSize: 24,
    bold: true,
    color: COLORS.ink,
    fontFace: "Georgia",
  });

  addCodeBlock(
    slide,
    0.5,
    0.9,
    7.6,
    5.9,
    "Pseudocódigo del recorrido",
    `Controller.AddItem(cartId, request)\n  SI modelo inválido → 400\n  resultado = Service.AddItem(...)\n  SI no éxito → 400 + mensaje\n  SI éxito → 201 Created\n\nService.AddItem\n  (id, code) = Repository.AddItem(...)\n  SEGÚN code:\n    0  → éxito\n    20 → "producto no activo"\n    22 → "stock insuficiente"\n    31 → "carrito no activo"\n\nRepository.AddItem\n  Execute usp_CartItem_Add\n  leer @CartItemId, @ResultCode\n  (nullable → Guid.Empty / -1)`
  );

  slide.addShape("roundRect", {
    x: 8.4,
    y: 0.9,
    w: 4.4,
    h: 5.9,
    fill: { color: COLORS.boxB },
    line: { color: COLORS.boxB },
    rectRadius: 0.1,
  });
  slide.addText("Idea clave", {
    x: 8.7,
    y: 1.2,
    w: 3.9,
    h: 0.4,
    fontSize: 16,
    bold: true,
    color: COLORS.sectionApi,
    fontFace: "Calibri",
  });
  slide.addText(
    "El SP decide el código de negocio.\n\nEl Service lo traduce a un mensaje humano.\n\nEl Controller solo elige el status HTTP.\n\nAsí cada capa tiene un solo trabajo.",
    {
      x: 8.7,
      y: 1.8,
      w: 3.9,
      h: 4.5,
      fontSize: 15,
      color: COLORS.ink,
      fontFace: "Calibri",
    }
  );
}

function sequenceSlide(pptx, page, total) {
  const slide = pptx.addSlide();
  addBg(slide);
  addAccentBar(slide, COLORS.sectionApi);
  addFooter(slide, page, total);
  slide.addText("Secuencia: agregar al carrito (API)", {
    x: 0.6,
    y: 0.25,
    w: 12,
    h: 0.45,
    fontSize: 26,
    bold: true,
    color: COLORS.ink,
    fontFace: "Georgia",
  });

  const actors = ["Controller", "Service", "Repository", "SP / SQL"];
  actors.forEach((a, i) => {
    const x = 1.2 + i * 3.0;
    slide.addShape("roundRect", {
      x,
      y: 1.0,
      w: 2.4,
      h: 0.55,
      fill: { color: i === 3 ? COLORS.accent : COLORS.sectionApi },
      line: { color: i === 3 ? COLORS.accent : COLORS.sectionApi },
      rectRadius: 0.06,
    });
    slide.addText(a, {
      x,
      y: 1.08,
      w: 2.4,
      h: 0.4,
      fontSize: 13,
      bold: true,
      color: COLORS.white,
      align: "center",
      fontFace: "Calibri",
    });
    slide.addShape("line", {
      x: x + 1.2,
      y: 1.55,
      w: 0,
      h: 5.0,
      line: { color: COLORS.line, width: 1.25, dashType: "dash" },
    });
  });

  const steps = [
    { y: 1.9, from: 0, to: 1, label: "AddItemAsync(request)" },
    { y: 2.7, from: 1, to: 2, label: "AddItemAsync(ids, qty)" },
    { y: 3.5, from: 2, to: 3, label: "usp_CartItem_Add" },
    { y: 4.3, from: 3, to: 2, label: "CartItemId + ResultCode" },
    { y: 5.1, from: 2, to: 1, label: "tupla (id, code)" },
    { y: 5.9, from: 1, to: 0, label: "éxito / mensaje error" },
  ];

  steps.forEach((s) => {
    const x1 = 1.2 + s.from * 3.0 + 1.2;
    const x2 = 1.2 + s.to * 3.0 + 1.2;
    const left = Math.min(x1, x2);
    const width = Math.abs(x2 - x1);
    slide.addShape("rightArrow", {
      x: left,
      y: s.y,
      w: Math.max(width, 0.4),
      h: 0.28,
      fill: { color: s.from < s.to ? "5B8FB9" : COLORS.accent },
      line: { color: s.from < s.to ? "5B8FB9" : COLORS.accent },
    });
    slide.addText(s.label, {
      x: left,
      y: s.y + 0.32,
      w: Math.max(width, 2.5),
      h: 0.3,
      fontSize: 11,
      color: COLORS.muted,
      fontFace: "Consolas",
      align: "center",
    });
  });
}

function feLayersSlide(pptx, page, total) {
  const slide = pptx.addSlide();
  addBg(slide);
  addAccentBar(slide, COLORS.sectionFe);
  addFooter(slide, page, total);
  slide.addText("Capas del frontend (React)", {
    x: 0.6,
    y: 0.3,
    w: 12,
    h: 0.5,
    fontSize: 28,
    bold: true,
    color: COLORS.ink,
    fontFace: "Georgia",
  });

  const layers = [
    { t: "Página / Vista", d: "CatalogPage, CartPage — componen la pantalla", c: COLORS.sectionFe },
    { t: "Provider / Hook", d: "CartProvider, useCart — estado y acciones", c: "9A5520" },
    { t: "Service Axios", d: "cartService, productService, apiPaths", c: "B06A2C" },
    { t: "Proxy Vite /api", d: "Reenvía a https://localhost:7157", c: COLORS.sectionApi },
  ];

  layers.forEach((l, i) => {
    const y = 1.2 + i * 1.3;
    slide.addShape("roundRect", {
      x: 2.0,
      y,
      w: 9.4,
      h: 1.1,
      fill: { color: l.c },
      line: { color: l.c },
      rectRadius: 0.08,
    });
    slide.addText(l.t, {
      x: 2.3,
      y: y + 0.15,
      w: 8.8,
      h: 0.4,
      fontSize: 20,
      bold: true,
      color: COLORS.white,
      fontFace: "Calibri",
    });
    slide.addText(l.d, {
      x: 2.3,
      y: y + 0.55,
      w: 8.8,
      h: 0.35,
      fontSize: 14,
      color: "F6EADF",
      fontFace: "Calibri",
    });
  });
}

function reuseSlide(pptx, page, total) {
  const slide = pptx.addSlide();
  addBg(slide);
  addAccentBar(slide, COLORS.sectionFe);
  addFooter(slide, page, total);
  slide.addText("Reutilización de componentes", {
    x: 0.6,
    y: 0.3,
    w: 12,
    h: 0.5,
    fontSize: 28,
    bold: true,
    color: COLORS.ink,
    fontFace: "Georgia",
  });

  const cards = [
    { t: "ProductCard / ProductGrid", d: "Misma tarjeta en catálogo, búsqueda y destacados." },
    { t: "CartProvider + useCart", d: "Una fuente de verdad para el carrito en toda la app." },
    { t: "Loading / Error / Empty", d: "Estados UI consistentes, sin copiar markup." },
    { t: "apiClient + apiPaths", d: "Una sola base URL y rutas centralizadas." },
  ];

  cards.forEach((c, i) => {
    const col = i % 2;
    const row = Math.floor(i / 2);
    const x = 0.6 + col * 6.3;
    const y = 1.2 + row * 2.6;
    slide.addShape("roundRect", {
      x,
      y,
      w: 6.0,
      h: 2.3,
      fill: { color: COLORS.surface },
      line: { color: COLORS.line },
      rectRadius: 0.1,
    });
    slide.addShape("rect", {
      x,
      y,
      w: 0.15,
      h: 2.3,
      fill: { color: COLORS.sectionFe },
      line: { color: COLORS.sectionFe },
    });
    slide.addText(c.t, {
      x: x + 0.45,
      y: y + 0.45,
      w: 5.2,
      h: 0.5,
      fontSize: 18,
      bold: true,
      color: COLORS.ink,
      fontFace: "Calibri",
    });
    slide.addText(c.d, {
      x: x + 0.45,
      y: y + 1.15,
      w: 5.2,
      h: 0.7,
      fontSize: 15,
      color: COLORS.muted,
      fontFace: "Calibri",
    });
  });
}

function e2eSlide(pptx, page, total) {
  const slide = pptx.addSlide();
  addBg(slide);
  addAccentBar(slide, COLORS.sectionFe);
  addFooter(slide, page, total);
  slide.addText("Viaje completo: del clic a la base de datos", {
    x: 0.5,
    y: 0.25,
    w: 12.2,
    h: 0.45,
    fontSize: 24,
    bold: true,
    color: COLORS.ink,
    fontFace: "Georgia",
  });

  const nodes = [
    { t: "ProductCard", s: "UI", c: COLORS.sectionFe },
    { t: "useCart", s: "Hook", c: "9A5520" },
    { t: "cartService", s: "Axios", c: "B06A2C" },
    { t: "CartController", s: "API", c: COLORS.sectionApi },
    { t: "CartService", s: "API", c: "2E6B9E" },
    { t: "Repository", s: "Dapper", c: "3D87B8" },
    { t: "usp_Cart\nItem_Add", s: "SQL", c: COLORS.accent },
  ];

  nodes.forEach((n, i) => {
    const x = 0.35 + i * 1.85;
    slide.addShape("roundRect", {
      x,
      y: 1.5,
      w: 1.7,
      h: 1.7,
      fill: { color: n.c },
      line: { color: n.c },
      rectRadius: 0.08,
    });
    slide.addText(n.t, {
      x,
      y: 1.7,
      w: 1.7,
      h: 0.9,
      fontSize: 11,
      bold: true,
      color: COLORS.white,
      align: "center",
      valign: "middle",
      fontFace: "Calibri",
    });
    slide.addText(n.s, {
      x,
      y: 2.7,
      w: 1.7,
      h: 0.3,
      fontSize: 11,
      color: "F0E6DC",
      align: "center",
      fontFace: "Calibri",
    });
    if (i < nodes.length - 1) {
      slide.addText("→", {
        x: x + 1.55,
        y: 2.05,
        w: 0.35,
        h: 0.35,
        fontSize: 16,
        color: COLORS.muted,
        align: "center",
      });
    }
  });

  slide.addShape("roundRect", {
    x: 0.5,
    y: 3.7,
    w: 12.3,
    h: 3.0,
    fill: { color: COLORS.surface },
    line: { color: COLORS.line },
    rectRadius: 0.1,
  });
  slide.addText("Narrativa para la clase", {
    x: 0.8,
    y: 3.95,
    w: 11.7,
    h: 0.4,
    fontSize: 16,
    bold: true,
    color: COLORS.ink,
    fontFace: "Calibri",
  });
  slide.addText(
    "1. El usuario pulsa “Agregar” en ProductCard.\n2. useCart pide getOrCreate del carrito y luego addItem.\n3. Axios envía POST /api/cart/{id}/items (vía proxy Vite).\n4. La API baja por Controller → Service → Repository → SP.\n5. SQL valida stock, escribe CartItem y devuelve ResultCode.\n6. El frontend refresca el carrito y actualiza la UI.",
    {
      x: 0.8,
      y: 4.45,
      w: 11.7,
      h: 2.0,
      fontSize: 14,
      color: COLORS.ink,
      fontFace: "Calibri",
    }
  );
}

function proxySlide(pptx, page, total) {
  const slide = pptx.addSlide();
  addBg(slide);
  addAccentBar(slide, COLORS.sectionFe);
  addFooter(slide, page, total);
  slide.addText("Proxy local (Vite)", {
    x: 0.6,
    y: 0.35,
    w: 12,
    h: 0.55,
    fontSize: 28,
    bold: true,
    color: COLORS.ink,
    fontFace: "Georgia",
  });

  const boxes = [
    { x: 1.0, t: "Navegador", d: "localhost:5173\n/api/cart/...", c: COLORS.sectionFe },
    { x: 5.0, t: "Proxy Vite", d: "reenvía /api\ny /images", c: "9A5520" },
    { x: 9.0, t: "API .NET", d: "https://localhost:7157", c: COLORS.sectionApi },
  ];
  boxes.forEach((b, i) => {
    slide.addShape("roundRect", {
      x: b.x,
      y: 1.8,
      w: 3.2,
      h: 2.4,
      fill: { color: b.c },
      line: { color: b.c },
      rectRadius: 0.1,
    });
    slide.addText(b.t, {
      x: b.x + 0.2,
      y: 2.1,
      w: 2.8,
      h: 0.5,
      fontSize: 18,
      bold: true,
      color: COLORS.white,
      align: "center",
      fontFace: "Calibri",
    });
    slide.addText(b.d, {
      x: b.x + 0.2,
      y: 2.8,
      w: 2.8,
      h: 1.0,
      fontSize: 14,
      color: "F6EADF",
      align: "center",
      fontFace: "Consolas",
    });
    if (i < 2) {
      slide.addText("→", {
        x: b.x + 3.15,
        y: 2.7,
        w: 0.7,
        h: 0.5,
        fontSize: 28,
        color: COLORS.muted,
        align: "center",
      });
    }
  });

  slide.addShape("roundRect", {
    x: 1.0,
    y: 4.8,
    w: 11.2,
    h: 1.7,
    fill: { color: COLORS.accentSoft },
    line: { color: COLORS.accentSoft },
    rectRadius: 0.08,
  });
  slide.addText(
    "En demo local el frontend no llama “directo” a otro origen: Vite enruta /api al backend.\nEso simplifica CORS y deja ver en Network las mismas rutas que usa la API.",
    {
      x: 1.3,
      y: 5.15,
      w: 10.6,
      h: 1.1,
      fontSize: 15,
      color: COLORS.ink,
      fontFace: "Calibri",
    }
  );
}

function demoSlide(pptx, page, total, num, title, steps, tip) {
  const slide = pptx.addSlide();
  addBg(slide);
  addAccentBar(slide, COLORS.sectionDemo);
  addFooter(slide, page, total);
  slide.addText(`Guion demo ${num}`, {
    x: 0.6,
    y: 0.3,
    w: 12,
    h: 0.4,
    fontSize: 14,
    bold: true,
    color: COLORS.sectionDemo,
    fontFace: "Calibri",
  });
  slide.addText(title, {
    x: 0.6,
    y: 0.7,
    w: 12,
    h: 0.5,
    fontSize: 26,
    bold: true,
    color: COLORS.ink,
    fontFace: "Georgia",
  });

  steps.forEach((s, i) => {
    const y = 1.5 + i * 0.95;
    slide.addShape("ellipse", {
      x: 0.7,
      y: y + 0.1,
      w: 0.5,
      h: 0.5,
      fill: { color: COLORS.accent },
      line: { color: COLORS.accent },
    });
    slide.addText(String(i + 1), {
      x: 0.7,
      y: y + 0.18,
      w: 0.5,
      h: 0.35,
      fontSize: 14,
      bold: true,
      color: COLORS.white,
      align: "center",
      fontFace: "Calibri",
    });
    slide.addText(s, {
      x: 1.5,
      y: y + 0.15,
      w: 11,
      h: 0.5,
      fontSize: 16,
      color: COLORS.ink,
      fontFace: "Calibri",
    });
  });

  if (tip) {
    slide.addShape("roundRect", {
      x: 0.6,
      y: 6.15,
      w: 12.1,
      h: 0.75,
      fill: { color: COLORS.warnSoft },
      line: { color: "E8D5A8" },
      rectRadius: 0.06,
    });
    slide.addText(tip, {
      x: 0.85,
      y: 6.3,
      w: 11.6,
      h: 0.45,
      fontSize: 13,
      color: COLORS.warn,
      fontFace: "Calibri",
    });
  }
}

function summarySlide(pptx, page, total) {
  const slide = pptx.addSlide();
  addBg(slide);
  addAccentBar(slide);
  addFooter(slide, page, total);
  slide.addText("Resumen: una responsabilidad por capa", {
    x: 0.6,
    y: 0.3,
    w: 12,
    h: 0.55,
    fontSize: 26,
    bold: true,
    color: COLORS.ink,
    fontFace: "Georgia",
  });

  const items = [
    { t: "Base de datos", d: "Modelo 3FN, estándares, SPs y ResultCode", c: COLORS.sectionDb },
    { t: "API", d: "HTTP → reglas → acceso a datos → SQL", c: COLORS.sectionApi },
    { t: "Frontend", d: "UI + estado + servicios; reutiliza componentes", c: COLORS.sectionFe },
    { t: "Hilo conductor", d: "El carrito muestra el viaje completo end-to-end", c: COLORS.accentDark },
  ];

  items.forEach((it, i) => {
    const y = 1.2 + i * 1.3;
    slide.addShape("roundRect", {
      x: 0.6,
      y,
      w: 12.1,
      h: 1.1,
      fill: { color: COLORS.surface },
      line: { color: COLORS.line },
      rectRadius: 0.08,
    });
    slide.addShape("rect", {
      x: 0.6,
      y,
      w: 0.18,
      h: 1.1,
      fill: { color: it.c },
      line: { color: it.c },
    });
    slide.addText(it.t, {
      x: 1.1,
      y: y + 0.2,
      w: 11,
      h: 0.35,
      fontSize: 18,
      bold: true,
      color: COLORS.ink,
      fontFace: "Calibri",
    });
    slide.addText(it.d, {
      x: 1.1,
      y: y + 0.55,
      w: 11,
      h: 0.35,
      fontSize: 15,
      color: COLORS.muted,
      fontFace: "Calibri",
    });
  });
}

function questionsSlide(pptx, page, total) {
  const slide = pptx.addSlide();
  slide.addShape("rect", {
    x: 0,
    y: 0,
    w: "100%",
    h: "100%",
    fill: { color: COLORS.accentDark },
    line: { color: COLORS.accentDark },
  });
  slide.addText("¿Preguntas?", {
    x: 0.8,
    y: 2.6,
    w: 11.5,
    h: 0.9,
    fontSize: 48,
    bold: true,
    color: COLORS.white,
    fontFace: "Georgia",
  });
  slide.addText("SKAMA · Base de datos · API · Frontend", {
    x: 0.8,
    y: 3.7,
    w: 11.5,
    h: 0.5,
    fontSize: 18,
    color: COLORS.accentSoft,
    fontFace: "Calibri",
  });
  slide.addText(`${page} / ${total}`, {
    x: 11.2,
    y: 7.15,
    w: 1.3,
    h: 0.3,
    fontSize: 10,
    color: "D0D8D4",
    align: "right",
    fontFace: "Calibri",
  });
}

function main() {
  const pptx = new PptxGenJS();
  pptx.defineLayout({ name: "SKAMA_WIDE", width: 13.333, height: 7.5 });
  pptx.layout = "SKAMA_WIDE";
  pptx.author = "SKAMA";
  pptx.title = "SKAMA — Arquitectura en capas";
  pptx.subject = "Presentación de clase: BD, API y Frontend";

  // Portada + agenda + monorepo + 4 separadores + contenidos + demos + cierre
  const total = 26;
  let page = 1;

  titleSlide(pptx, total); // 1
  page = 2;

  agendaSlide(pptx, page++, total); // 2
  monorepoSlide(pptx, page++, total); // 3

  sectionSlide(
    pptx,
    "01 · Base de datos",
    "Estándares, relaciones, normalización y stored procedures",
    COLORS.sectionDb,
    page++,
    total
  );
  whySpSlide(pptx, page++, total);
  namingSlide(pptx, page++, total);
  erSlide(pptx, page++, total);
  n3Slide(pptx, page++, total);
  spCartSlide(pptx, page++, total);
  spOrderSlide(pptx, page++, total);

  sectionSlide(
    pptx,
    "02 · API",
    "Controllers, Services, Repositories, Models y DTOs",
    COLORS.sectionApi,
    page++,
    total
  );
  apiLayersSlide(pptx, page++, total);
  apiRolesSlide(pptx, page++, total);
  dtoSlide(pptx, page++, total);
  apiFlowSlide(pptx, page++, total);
  sequenceSlide(pptx, page++, total);

  sectionSlide(
    pptx,
    "03 · Frontend",
    "Servicios, providers, componentes y el viaje de la información",
    COLORS.sectionFe,
    page++,
    total
  );
  feLayersSlide(pptx, page++, total);
  reuseSlide(pptx, page++, total);
  e2eSlide(pptx, page++, total);
  proxySlide(pptx, page++, total);

  sectionSlide(
    pptx,
    "04 · Demo",
    "Qué mostrar en pantalla (sin leer código línea a línea)",
    COLORS.sectionDemo,
    page++,
    total
  );
  demoSlide(
    pptx,
    page++,
    total,
    "1",
    "Catálogo + agregar al carrito",
    [
      "Abrir catálogo autenticado y mostrar una ProductCard.",
      "Abrir DevTools → Network antes de hacer clic.",
      "Agregar producto: señalar POST /api/cart/.../items.",
      "Mostrar respuesta 201 o 400 con mensaje de negocio.",
      "Refrescar/abrir carrito y relacionarlo con el SP.",
    ],
    "Tip: si falla, usar el ResultCode (20/22/31) como hilo de explicación."
  );
  demoSlide(
    pptx,
    page++,
    total,
    "2",
    "Carrito y checkout",
    [
      "Abrir detalle del carrito (GET /api/cart/{id}).",
      "Explicar totales e ítems como lectura del SP GetDetail.",
      "Ejecutar checkout (crear orden desde carrito).",
      "Relacionar con usp_Order_CreateFromCart (transacción).",
      "Mostrar que el carrito pasa a CHECKED_OUT.",
    ],
    "Tip: enfatizar “todo o nada”: stock + orden + estado del carrito."
  );
  summarySlide(pptx, page++, total);
  questionsSlide(pptx, page++, total);

  if (page - 1 !== total) {
    console.warn(`Aviso: última página numerada=${page - 1}, total declarado=${total}`);
  }

  const out = path.join(__dirname, "presentacion-skama-capas.pptx");
  return pptx.writeFile({ fileName: out }).then(() => {
    console.log(`OK: ${out}`);
    console.log(`Páginas numeradas hasta: ${page - 1} / ${total}`);
  });
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
