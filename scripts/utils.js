import { REVERS_DICE, PARAMETRS, TRANSLATE } from "./constant.js";

export function parseString(input) {
    if (!input) return { number: 0, text: '' };
        
    const numMatch = input.match(/^[+-]?\d+/);
    const number = numMatch ? parseInt(numMatch[0], 10) : 0;
    const text = input.replace(/^[+-]?\d+/, '');
    
    return { number, text };
}

export function drawGraphLines(html) {
    const ruler = html[0].querySelector(".ruler");
    if (!ruler) return;

    const prev = ruler.querySelector("svg.graph-overlay");
    if (prev) prev.remove();

    const groups = Array.from(ruler.querySelectorAll(".group"));
    if (groups.length === 0) return;

    const points = [];
    groups.forEach(group => {
        const activeCircle = group.querySelector(".cell.active .circle");
        if (activeCircle) {
        const circleRect = activeCircle.getBoundingClientRect();
        const parentRect = ruler.getBoundingClientRect();
        const x = circleRect.left - parentRect.left + circleRect.width / 2;
        const y = circleRect.top  - parentRect.top  + circleRect.height / 2;
        points.push([x, y]);
        } else {
            // pass
        }
    });

    if (points.length < 2) return;

    const svgNS = "http://www.w3.org/2000/svg";
    const svg = document.createElementNS(svgNS, "svg");
    svg.classList.add("graph-overlay");
    svg.setAttribute("width", ruler.clientWidth);
    svg.setAttribute("height", ruler.clientHeight);
    svg.setAttribute("viewBox", `0 0 ${ruler.clientWidth} ${ruler.clientHeight}`);
    svg.style.position = "absolute";
    svg.style.left = 0;
    svg.style.top = 0;
    svg.style.pointerEvents = "none";
    svg.style.overflow = "visible";

    const poly = document.createElementNS(svgNS, "polyline");
    poly.setAttribute("fill", "none");
    poly.setAttribute("stroke", "#d9534f");
    poly.setAttribute("stroke-width", "3");
    poly.setAttribute("stroke-linecap", "round");
    poly.setAttribute("stroke-linejoin", "round");
    poly.setAttribute("points", points.map(p => `${p[0]},${p[1]}`).join(" "));
    svg.appendChild(poly);

    poly.setAttribute("stroke-opacity", "0.95");

    ruler.appendChild(svg);
}

export async function askOrder(skills, dice) {
    const param1 = skills[0];
    const param2 = skills[1];
    const revers_dice = REVERS_DICE[dice];

    return await new Promise(resolve => {
        const content = `
        <div class="osore-order-dialog">
            <style>
                .osore-order-dialog {
                    font-family: Inter, sans-serif;
                    color: var(--ink, #111);
                }

                .osore-order-container {
                    background: var(--paper, #fbf9f7);
                    border: 6px solid var(--ink, #0a0a0a);
                    box-shadow: 8px 8px 0 rgba(0,0,0,0.06);
                    padding: 20px;
                    border-radius: 8px;
                    max-width: 500px;
                }

                .osore-order-title {
                    font-weight: 800;
                    letter-spacing: 0.6px;
                    text-transform: uppercase;
                    color: var(--ink, #111);
                    font-size: 17px;
                    margin-bottom: 16px;
                    text-align: center;
                }

                .osore-order-description {
                    color: var(--muted, #6b6b6b);
                    font-size: 14px;
                    margin-bottom: 20px;
                    text-align: center;
                    font-style: italic;
                }

                .osore-order-options {
                    display: flex;
                    flex-direction: column;
                    gap: 12px;
                }

                .osore-order-option {
                    background: white;
                    border: 2px solid rgba(0,0,0,0.08);
                    border-radius: 6px;
                    padding: 16px;
                    cursor: pointer;
                    transition: all 0.2s ease;
                    position: relative;
                }

                .osore-order-option:hover {
                    background: rgba(0,0,0,0.03);
                    border-color: var(--ink, #0a0a0a);
                }

                .osore-order-option input[type="radio"] {
                    position: absolute;
                    opacity: 0;
                    cursor: pointer;
                }

                .osore-order-option-label {
                    display: block;
                    padding-left: 28px;
                    position: relative;
                    cursor: pointer;
                }

                .osore-order-option-label::before {
                    content: "";
                    position: absolute;
                    left: 0;
                    top: 50%;
                    transform: translateY(-50%);
                    width: 18px;
                    height: 18px;
                    border: 2px solid rgba(0,0,0,0.3);
                    border-radius: 50%;
                    background: white;
                }

                .osore-order-option input[type="radio"]:checked + .osore-order-option-label::before {
                    background: var(--ink, #0a0a0a);
                    border-color: var(--ink, #0a0a0a);
                }

                .osore-order-option-title {
                    font-weight: 700;
                    color: var(--ink, #111);
                    margin-bottom: 4px;
                    font-size: 15px;
                }

                .osore-order-option-values {
                    color: var(--muted, #6b6b6b);
                    font-size: 14px;
                    margin-top: 2px;
                }

                .osore-order-buttons {
                    display: flex;
                    justify-content: flex-end;
                    gap: 12px;
                    margin-top: 20px;
                    padding-top: 15px;
                    border-top: 1px solid rgba(0,0,0,0.1);
                }

                .osore-order-buttons button {
                    padding: 8px 20px;
                    background: white;
                    border: 2px solid rgba(0,0,0,0.08);
                    border-radius: 6px;
                    font-family: inherit;
                    font-size: 14px;
                    color: var(--ink, #111);
                    cursor: pointer;
                    transition: all 0.2s ease;
                }

                .osore-order-buttons button:hover {
                    background: rgba(0,0,0,0.03);
                    border-color: var(--ink, #0a0a0a);
                }

                .osore-order-buttons .cancel {
                    background: rgba(217, 83, 79, 0.1);
                    border-color: rgba(217, 83, 79, 0.3);
                    color: rgba(217, 83, 79, 0.8);
                }

                .osore-order-buttons .cancel:hover {
                    background: rgba(217, 83, 79, 0.2);
                    border-color: rgba(217, 83, 79, 0.5);
                }
            </style>

            <div class="osore-order-container">
                <div class="osore-order-title">ВЫБОР ПОРЯДКА</div>
                <div class="osore-order-description">Выберите, какой навык будет основным</div>
                
                <div class="osore-order-options">
                    <label class="osore-order-option">
                        <input type="radio" name="order" value="0" checked>
                        <div class="osore-order-option-label">
                            <div class="osore-order-option-title">
                                1) ${TRANSLATE[param1]} → 2) ${TRANSLATE[param2]}
                            </div>
                            <div class="osore-order-option-values">
                                (${PARAMETRS[param1][dice].value} → ${PARAMETRS[param2][revers_dice].value})
                            </div>
                        </div>
                    </label>

                    <label class="osore-order-option">
                        <input type="radio" name="order" value="1">
                        <div class="osore-order-option-label">
                            <div class="osore-order-option-title">
                                1) ${TRANSLATE[param2]} → 2) ${TRANSLATE[param1]}
                            </div>
                            <div class="osore-order-option-values">
                                (${PARAMETRS[param2][dice].value} → ${PARAMETRS[param1][revers_dice].value})
                            </div>
                        </div>
                    </label>
                </div>
            </div>
        </div>
        `;

        const dlg = new Dialog({
            title: "",
            content,
            buttons: {
                ok: {
                    label: "ПОДТВЕРДИТЬ",
                    callback: html => {
                        const value = html.find("input[name='order']:checked").val();
                        resolve(value === "0" ? [param1, param2] : [param2, param1]);
                    }
                },
                cancel: {
                    label: "ОТМЕНА",
                    callback: () => resolve(null)
                }
            },
            default: "ok",
            classes: ["osore-dialog"],
            close: () => {}
        });

        dlg.render(true);
    });
}

export function getChooseSchemeHtml(title, options = [], hint = "") {
    const content = `
            <div class="osore-pick-dialog">
                <style>
                    .osore-pick-dialog {
                        font-family: Inter, sans-serif;
                        color: var(--ink, #111);
                    }

                    .osore-pick-container {
                        background: var(--paper, #fbf9f7);
                        border: 6px solid var(--ink, #0a0a0a);
                        box-shadow: 8px 8px 0 rgba(0,0,0,0.06);
                        padding: 20px;
                        border-radius: 8px;
                        max-width: 500px;
                    }

                    .osore-pick-title {
                        font-weight: 800;
                        letter-spacing: 0.6px;
                        text-transform: uppercase;
                        color: var(--ink, #111);
                        font-size: 17px;
                        margin-bottom: 16px;
                        text-align: center;
                    }

                    .osore-pick-hint {
                        background: rgba(0,0,0,0.03);
                        border-left: 3px solid var(--ink, #0a0a0a);
                        padding: 12px 15px;
                        margin-bottom: 20px;
                        font-style: italic;
                        color: var(--muted, #6b6b6b);
                        font-size: 14px;
                        border-radius: 0 8px 8px 0;
                    }

                    .osore-pick-options {
                        display: flex;
                        flex-direction: column;
                        gap: 10px;
                    }

                    .osore-pick-button {
                        padding: 12px 16px;
                        background: white;
                        border: 2px solid rgba(0,0,0,0.08);
                        border-radius: 6px;
                        font-family: inherit;
                        font-size: 15px;
                        color: var(--ink, #111);
                        font-weight: 500;
                        cursor: pointer;
                        text-align: left;
                        transition: all 0.2s ease;
                    }

                    .osore-pick-button:hover {
                        background: rgba(0,0,0,0.03);
                        border-color: var(--ink, #0a0a0a);
                        transform: translateX(2px);
                    }

                    .osore-pick-buttons {
                        display: flex;
                        justify-content: flex-end;
                        gap: 12px;
                        margin-top: 16px;
                        padding-top: 12px;
                        border-top: 1px solid rgba(0,0,0,0.1);
                    }

                    .osore-pick-buttons button {
                        padding: 8px 16px;
                        background: white;
                        border: 2px solid rgba(0,0,0,0.08);
                        border-radius: 6px;
                        font-family: inherit;
                        font-size: 14px;
                        color: var(--ink, #111);
                        cursor: pointer;
                        transition: all 0.2s ease;
                    }

                    .osore-pick-buttons button:hover {
                        background: rgba(0,0,0,0.03);
                        border-color: var(--ink, #0a0a0a);
                    }

                    .osore-back-button {
                        background: rgba(217, 83, 79, 0.1);
                        border-color: rgba(217, 83, 79, 0.3);
                        color: rgba(217, 83, 79, 0.8);
                    }

                    .osore-back-button:hover {
                        background: rgba(217, 83, 79, 0.2);
                        border-color: rgba(217, 83, 79, 0.5);
                    }
                </style>

                <div class="osore-pick-container">
                    <div class="osore-pick-title">${title}</div>
                    
                    ${hint ? `<div class="osore-pick-hint">${hint}</div>` : ''}
                    
                    <div class="osore-pick-options">
                        ${options.map((o, i) => `
                            <button class="osore-pick-button" data-value="${o}">
                                ${o}
                            </button>
                        `).join("")}
                    </div>
                </div>
            </div>
            `;
}

export function getResultHtml(scheme, rolls, parameters){
    const content = `
        <div class="osore-dialog-wrap">
        <style>
            .osore-dialog-wrap {
            font-family: Inter, sans-serif;
            color: var(--ink, #111);
            }

            .osore-doc {
            background: var(--paper, #fbf9f7);
            border: 2px solid rgba(0,0,0,0.12);
            box-shadow: 8px 8px 0 rgba(0,0,0,0.06);
            padding: 18px;
            border-radius: 8px;
            max-width: 640px;
            }

            .osore-doc-title {
            font-weight: 800;
            letter-spacing: 0.6px;
            text-transform: uppercase;
            color: var(--ink, #111);
            font-size: 17px;
            margin-bottom: 12px;
            }

            .osore-section {
            margin-top: 10px;
            margin-bottom: 6px;
            font-weight: 700;
            font-size: 14px;
            text-transform: uppercase;
            color: #444;
            }

            .osore-doc-body {
            display: flex;
            flex-direction: column;
            gap: 10px;
            padding-top: 4px;
            }

            .osore-row {
            display: flex;
            justify-content: space-between;
            border-bottom: 1px dashed rgba(0,0,0,0.1);
            padding: 4px 0 6px;
            }

            .osore-row:last-child {
            border-bottom: none;
            }

            .osore-key {
            font-size: 13px;
            color: var(--muted, #6b6b6b);
            text-transform: uppercase;
            letter-spacing: 0.5px;
            font-weight: 700;
            min-width: 150px;
            }

            .osore-value {
            text-align: right;
            font-size: 14px;
            color: var(--ink, #111);
            }
        </style>

        <div class="osore-doc">
            <div class="osore-doc-title">Результат создания персонажа</div>
            <div class="osore-doc-body">

            <div class="osore-section">Схема</div>
            <div class="osore-row">
                <div class="osore-key">Схема</div>
                <div class="osore-value">${scheme}</div>
            </div>

            <div class="osore-section">Броски</div>
            ${rolls
                .map((r, i) => `
                <div class="osore-row">
                    <div class="osore-key">Бросок ${i + 1}</div>
                    <div class="osore-value">${r}</div>
                </div>
                `)
                .join("")}

            <div class="osore-section">Параметры</div>
            ${parameters
                .map(p => `
                <div class="osore-row">
                    <div class="osore-key">${p.name}</div>
                    <div class="osore-value">${p.value} (${p.modifier})</div>
                </div>
                `)
                .join("")}

            </div>
        </div>
        </div>
        `;
    return content
}

  