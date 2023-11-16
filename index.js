document.getElementById('process-btn').addEventListener('click', function () {
    const inputCss = document.getElementById('input-css').value;
    const processedCss = processCSS(inputCss);
    displayProcessedCSS(processedCss);
});

function processCSS(css) {
    const rules = css.split('}')
        .map(rule => rule.trim())
        .filter(rule => rule.length);

    const cssMap = new Map();

    rules.forEach(rule => {
        const [selectors, properties] = rule.split('{').map(part => part.trim());
        if (!cssMap.has(selectors)) {
            cssMap.set(selectors, new Map());
        }
        properties.split(';').forEach(prop => {
            const [key, value] = prop.split(':').map(p => p.trim());
            if (key && value) {
                cssMap.get(selectors).set(key, value);
            }
        });
    });

    let result = '';
    cssMap.forEach((propsMap, selectors) => {
        const propsString = Array.from(propsMap).map(([key, value]) => `${key}: ${value}`).join('; ');
        result += `${selectors} { ${propsString} }\n`;
    });

    return result;
}

function displayProcessedCSS(css) {
    const container = document.getElementById('output-container');
    container.innerHTML = ''; // コンテナをクリア

    const cssOutputDiv = document.createElement('div');
    cssOutputDiv.classList.add('css-output');

    const button = document.createElement('button');
    button.id = 'copy-btn';
    button.innerText = 'Copy CSS';

    const pre = document.createElement('pre');
    pre.textContent = css;
    pre.setAttribute('id', 'css-content-pre')

    cssOutputDiv.appendChild(button);
    cssOutputDiv.appendChild(pre);
    container.appendChild(cssOutputDiv);

    button.addEventListener('click', function () {
        navigator.clipboard.writeText(css).then(() => {
            alert('CSS copied to clipboard!');
        }).catch(err => {
            console.error('Error in copying text: ', err);
        });
    });
}

document.getElementById('reset-btn').addEventListener('click', function () {
    // 入力エリアをクリア
    document.getElementById('input-css').value = '';

    const pre = document.getElementById('css-content-pre');
    if (pre) {
        pre.textContent = '';
    }
});