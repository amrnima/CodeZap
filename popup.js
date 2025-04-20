document.addEventListener("DOMContentLoaded", () => {
    const input = document.getElementById("input");
    const output = document.getElementById("output");

    const jsonToYamlBtn = document.getElementById("jsonToYamlBtn");
    const xmlToJsonBtn = document.getElementById("xmlToJsonBtn");
    const jsonToXmlBtn = document.getElementById("jsonToXmlBtn");
    const minifyBtn = document.getElementById("minifyBtn");
    const unminifyBtn = document.getElementById("unminifyBtn");
    const hexToRgbBtn = document.getElementById("hexToRgbBtn");
    const rgbToHexBtn = document.getElementById("rgbToHexBtn");
    const yamlToJsonBtn = document.getElementById("yamlToJsonBtn");
    const copyOutputBtn = document.getElementById("copyOutputBtn");

    const copyCssRgbBtn = document.getElementById("copyCssRgbBtn");

    // Tab switching
    const tabLinks = document.querySelectorAll(".tab-link");
    const tabContents = document.querySelectorAll(".tab-content");

    const inputTextarea = document.getElementById("input");
    const labelInput = document.getElementById("labelInput");
    const outputBox = document.getElementById("output");
    const copyOutputBtnElement = document.getElementById("copyOutputBtn");

    tabLinks.forEach(link => {
        link.addEventListener("click", () => {
            tabLinks.forEach(l => l.classList.remove("active"));
            tabContents.forEach(c => c.classList.remove("active"));

            link.classList.add("active");
            const tabId = link.getAttribute("data-tab");
            document.getElementById(tabId).classList.add("active");

            // مخفی کردن textarea و باکس خروجی توی تب Color
            if (tabId === "tab-color") {
                inputTextarea.style.display = "none";
                labelInput.style.display = "none";
                outputBox.parentElement.style.display = "none"; // مخفی کردن کل textarea-wrapper خروجی
            } else {
                inputTextarea.style.display = "block";
                labelInput.style.display = "block";
                outputBox.parentElement.style.display = "block";
            }
        });
    });

    if (document.querySelector(".tab-link.active").getAttribute("data-tab") === "tab-color") {
        inputTextarea.style.display = "none";
        labelInput.style.display = "none";
        outputBox.parentElement.style.display = "none";
    }

    // JSON to YAML
    jsonToYamlBtn.addEventListener("click", () => {
        try {
            const jsonData = JSON.parse(input.value.trim());
            const yamlData = jsyaml.dump(jsonData);
            output.textContent = yamlData;
        } catch (e) {
            output.textContent = "Error: Invalid JSON";
        }
    });

    // XML to JSON
    xmlToJsonBtn.addEventListener("click", () => {
        try {
            const xmlData = input.value.trim();
            xml2js.parseString(xmlData, (err, result) => {
                if (err) {
                    output.textContent = "Error: Invalid XML";
                } else {
                    output.textContent = JSON.stringify(result, null, 2);
                }
            });
        } catch (e) {
            output.textContent = "Error: Invalid input";
        }
    });

    // JSON to XML
    jsonToXmlBtn.addEventListener("click", () => {
        try {
            const jsonData = JSON.parse(input.value.trim());
            const builder = new xml2js.Builder();
            const xmlData = builder.buildObject(jsonData);
            output.textContent = xmlData;
        } catch (e) {
            output.textContent = "Error: Invalid JSON";
        }
    });

    // Minify
    minifyBtn.addEventListener("click", () => {
        try {
            const data = input.value.trim();
            if (data.startsWith("{") || data.startsWith("[")) {
                // JSON
                const jsonData = JSON.parse(data);
                output.textContent = JSON.stringify(jsonData);
            } else if (data.startsWith("<")) {
                // XML
                xml2js.parseString(data, (err, result) => {
                    if (err) {
                        output.textContent = "Error: Invalid XML";
                    } else {
                        const builder = new xml2js.Builder({ headless: true, renderOpts: { pretty: false } });
                        output.textContent = builder.buildObject(result);
                    }
                });
            } else {
                // YAML
                const jsonData = jsyaml.load(data);
                const yamlData = jsyaml.dump(jsonData, { lineWidth: -1, noCompatMode: true });
                output.textContent = yamlData;
            }
        } catch (e) {
            output.textContent = "Error: Invalid input";
        }
    });

    // Unminify
    unminifyBtn.addEventListener("click", () => {
        try {
            const data = input.value.trim();
            if (data.startsWith("{") || data.startsWith("[")) {
                // JSON
                const jsonData = JSON.parse(data);
                output.textContent = JSON.stringify(jsonData, null, 2);
            } else if (data.startsWith("<")) {
                // XML
                xml2js.parseString(data, (err, result) => {
                    if (err) {
                        output.textContent = "Error: Invalid XML";
                    } else {
                        const builder = new xml2js.Builder({ renderOpts: { pretty: true, indent: "  " } });
                        output.textContent = builder.buildObject(result);
                    }
                });
            } else {
                // YAML
                const jsonData = jsyaml.load(data);
                const yamlData = jsyaml.dump(jsonData);
                output.textContent = yamlData;
            }
        } catch (e) {
            output.textContent = "Error: Invalid input";
        }
    });

    // Hex to RGB
    hexToRgbBtn.addEventListener("click", () => {
        try {
            const hex = document.getElementById("colorInput").value.trim();
            const hexRegex = /^#?([0-9A-Fa-f]{6}|[0-9A-Fa-f]{3})$/;
            if (!hexRegex.test(hex)) {
                output.textContent = "Error: Invalid Hex color code";
                return;
            }

            const cleanHex = hex.replace("#", "");
            const fullHex = cleanHex.length === 3 ? cleanHex.split("").map(char => char + char).join("") : cleanHex;

            const r = parseInt(fullHex.substring(0, 2), 16);
            const g = parseInt(fullHex.substring(2, 4), 16);
            const b = parseInt(fullHex.substring(4, 6), 16);

            // پر کردن فیلدهای RGB (0-255)
            document.getElementById("red255").value = r;
            document.getElementById("green255").value = g;
            document.getElementById("blue255").value = b;

            // پر کردن فیلدهای RGB (0-1)
            const r1 = (r / 255).toFixed(8);
            const g1 = (g / 255).toFixed(8);
            const b1 = (b / 255).toFixed(8);
            document.getElementById("red1").value = r1;
            document.getElementById("green1").value = g1;
            document.getElementById("blue1").value = b1;

            // پر کردن CSS color
            document.getElementById("cssRgb255").value = `rgb(${r}, ${g}, ${b})`;
            document.getElementById("cssRgbPercent").value = `rgb(${(r1 * 100).toFixed(2)}%, ${(g1 * 100).toFixed(2)}%, ${(b1 * 100).toFixed(2)}%)`;

            // پیش‌نمایش رنگ
            document.getElementById("colorPreview").style.backgroundColor = `rgb(${r}, ${g}, ${b})`;

            // نمایش خروجی توی باکس اصلی (که الان توی تب Color مخفیه)
            output.textContent = `rgb(${r}, ${g}, ${b})`;
        } catch (e) {
            output.textContent = "Error: Invalid input";
        }
    });

    // YAML to JSON
    yamlToJsonBtn.addEventListener("click", () => {
        try {
            const yamlData = input.value.trim();
            const jsonData = jsyaml.load(yamlData);
            output.textContent = JSON.stringify(jsonData, null, 2);
        } catch (e) {
            output.textContent = "Error: Invalid YAML";
        }
    });

    // Copy Output
    function showNotification(message) {
        const notification = document.getElementById("notification");
        notification.textContent = message;
        notification.classList.add("show");
        setTimeout(() => {
            notification.classList.remove("show");
        }, 2000); // محو شدن بعد از 2 ثانیه
    }

    // Copy CSS RGB (0-255)
    function setupCopyCssRgbBtn() {
        const copyCssRgbBtn = document.getElementById("copyCssRgbBtn");
        if (copyCssRgbBtn) {
            copyCssRgbBtn.addEventListener("click", () => {
                const textToCopy = document.getElementById("cssRgb255").value;
                if (textToCopy) {
                    navigator.clipboard.writeText(textToCopy).then(() => {
                        showNotification("CSS RGB color copied!");
                    }).catch(() => {
                        showNotification("Error: Could not copy!");
                    });
                } else {
                    showNotification("Nothing to copy!");
                }
            });
        } else {
            console.error("Could not find copyCssRgbBtn");
        }
    }

    // Copy Output
    copyOutputBtn.addEventListener("click", () => {
        const textToCopy = output.textContent;
        if (textToCopy) {
            navigator.clipboard.writeText(textToCopy).then(() => {
                showNotification("Output copied!");
            }).catch(() => {
                showNotification("Error: Could not copy!");
            });
        } else {
            showNotification("Nothing to copy!");
        }
    });

    // Copy CSS RGB (0-255)
    copyCssRgbBtn.addEventListener("click", () => {
        console.log('textToCopy 2222: ')
        const textToCopy = document.getElementById("cssRgb255").value;
        console.log('textToCopy : ', textToCopy)
        if (textToCopy) {
            navigator.clipboard.writeText(textToCopy).then(() => {
                setupCopyCssRgbBtn("CSS RGB color copied to clipboard!");
            }).catch(() => {
                setupCopyCssRgbBtn("Error: Could not copy to clipboard");
            });
        } else {
            setupCopyCssRgbBtn("Nothing to copy!");
        }
    });
});