document.addEventListener("DOMContentLoaded", () => {
    // چک کردن لود شدن X2JS
    if (typeof window.X2JS === "undefined") {
        console.error("X2JS is not loaded properly");
        document.getElementById("output").textContent = "Error: Required library (X2JS) is not loaded";
        return;
    }

    // چک کردن لود شدن jsyaml
    if (typeof jsyaml === "undefined") {
        console.error("jsyaml is not loaded properly");
        document.getElementById("output").textContent = "Error: Required library (js-yaml) is not loaded";
        return;
    }

    const x2js = new window.X2JS(); // ساختن نمونه از X2JS

    const tabLinks = document.querySelectorAll(".tab-link");
    const tabContents = document.querySelectorAll(".tab-content");
    const input = document.getElementById("input");
    const output = document.getElementById("output");
    const xmlToJsonBtn = document.getElementById("xmlToJsonBtn");
    const jsonToXmlBtn = document.getElementById("jsonToXmlBtn");
    const yamlToJsonBtn = document.getElementById("yamlToJsonBtn");
    const jsonToYamlBtn = document.getElementById("jsonToYamlBtn");
    const hexToRgbBtn = document.getElementById("hexToRgbBtn");
    const rgbToHexBtn = document.getElementById("rgbToHexBtn");
    const colorPreview = document.getElementById("colorPreview");
    const minifyBtn = document.getElementById("minifyBtn");
    const unminifyBtn = document.getElementById("unminifyBtn");
    const copyOutputBtn = document.getElementById("copyOutputBtn");
    const copyCssRgbBtn = document.getElementById("copyCssRgbBtn");

    // مدیریت تب‌ها
    tabLinks.forEach(link => {
        link.addEventListener("click", () => {
            tabLinks.forEach(l => l.classList.remove("active"));
            tabContents.forEach(c => c.classList.remove("active"));
            link.classList.add("active");
            const tabId = link.getAttribute("data-tab");
            document.getElementById(tabId).classList.add("active");
            input.value = "";
            output.textContent = "";
            if (tabId !== "colorTab") {
                colorPreview.style.display = "block";
            }
        });
    });

    //  XML: JSON to XML
    jsonToXmlBtn.addEventListener("click", () => {
        try {
            const inputData = input.value.trim();
            if (!inputData) {
                output.textContent = "Error: Input is empty";
                return;
            }
            if (!inputData.startsWith("{") && !inputData.startsWith("[")) {
                output.textContent = "Error: Input must be a valid JSON (starting with { or [)";
                return;
            }
            const jsonData = JSON.parse(inputData);
            const wrappedJson = { root: jsonData }; // اضافه کردن root
            const xmlData = x2js.json2xml_str(wrappedJson);
            output.textContent = xmlData;
        } catch (e) {
            output.textContent = `Error: Invalid JSON - ${e.message}`;
        }
    });

    //  XML: XML to JSON
    xmlToJsonBtn.addEventListener("click", () => {
        try {
            const xmlData = input.value.trim();
            if (!xmlData) {
                output.textContent = "Error: Input is empty";
                return;
            }
            if (!xmlData.startsWith("<")) {
                output.textContent = "Error: Input must be a valid XML (starting with <)";
                return;
            }
            const jsonData = x2js.xml_str2json(xmlData);
            if (jsonData === null) {
                output.textContent = "Error: Invalid XML";
            } else {
                if (jsonData && jsonData.root) {
                    output.textContent = JSON.stringify(jsonData.root, null, 2); // حذف root
                } else {
                    output.textContent = JSON.stringify(jsonData, null, 2);
                }
            }
        } catch (e) {
            output.textContent = `Error: Invalid input - ${e.message}`;
        }
    });

    //  YAML: YAML to JSON
    yamlToJsonBtn.addEventListener("click", () => {
        try {
            const yamlData = input.value.trim();
            if (!yamlData) {
                output.textContent = "Error: Input is empty";
                return;
            }
            const jsonData = jsyaml.load(yamlData);
            output.textContent = JSON.stringify(jsonData, null, 2);
        } catch (e) {
            output.textContent = `Error: Invalid YAML - ${e.message}`;
        }
    });

    //  YAML: JSON to YAML
    jsonToYamlBtn.addEventListener("click", () => {
        try {
            const inputData = input.value.trim();
            if (!inputData) {
                output.textContent = "Error: Input is empty";
                return;
            }
            if (!inputData.startsWith("{") && !inputData.startsWith("[")) {
                output.textContent = "Error: Input must be a valid JSON (starting with { or [)";
                return;
            }
            const jsonData = JSON.parse(inputData);
            const yamlData = jsyaml.dump(jsonData);
            output.textContent = yamlData;
        } catch (e) {
            output.textContent = `Error: Invalid JSON - ${e.message}`;
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

            document.getElementById("red255").value = r;
            document.getElementById("green255").value = g;
            document.getElementById("blue255").value = b;

            const r1 = (r / 255).toFixed(8);
            const g1 = (g / 255).toFixed(8);
            const b1 = (b / 255).toFixed(8);
            document.getElementById("red1").value = r1;
            document.getElementById("green1").value = g1;
            document.getElementById("blue1").value = b1;

            document.getElementById("cssRgb255").value = `rgb(${r}, ${g}, ${b})`;
            document.getElementById("cssRgbPercent").value = `rgb(${(r1 * 100).toFixed(2)}%, ${(g1 * 100).toFixed(2)}%, ${(b1 * 100).toFixed(2)}%)`;

            document.getElementById("colorPreview").style.backgroundColor = `rgb(${r}, ${g}, ${b})`;

            output.textContent = `rgb(${r}, ${g}, ${b})`;
        } catch (e) {
            output.textContent = "Error: Invalid input";
        }
    });

    //  Minify/Unminify: Minify
    minifyBtn.addEventListener("click", () => {
        const inputData = input.value.trim();
        if (!inputData) {
            output.textContent = "Error: Input is empty";
            return;
        }
        try {
            const parsed = JSON.parse(inputData);
            const minified = JSON.stringify(parsed);
            output.textContent = minified;
        } catch (e) {
            output.textContent = `Error: Invalid JSON - ${e.message}`;
        }
    });

    //  Minify/Unminify: Unminify
    unminifyBtn.addEventListener("click", () => {
        const inputData = input.value.trim();
        if (!inputData) {
            output.textContent = "Error: Input is empty";
            return;
        }
        try {
            const parsed = JSON.parse(inputData);
            const unminified = JSON.stringify(parsed, null, 2);
            output.textContent = unminified;
        } catch (e) {
            output.textContent = `Error: Invalid JSON - ${e.message}`;
        }
    });

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