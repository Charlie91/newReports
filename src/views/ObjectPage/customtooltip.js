export const customLabel = function(tooltipModel) {
    // Tooltip Element
    var tooltipEl = document.getElementById('chartjs-tooltip');

    // Create element on first render
    if (!tooltipEl) {
        tooltipEl = document.createElement('div');
        tooltipEl.id = 'chartjs-tooltip';
        tooltipEl.innerHTML = "<div></div>";
        document.body.appendChild(tooltipEl);
        //////////////////////////////
        tooltipEl.style.position='absolute';
        tooltipEl.style.textAlign='center';
        tooltipEl.style.color=tooltipModel.bodyFontColor;
        tooltipEl.style.backgroundColor=tooltipModel.backgroundColor;
        tooltipEl.style.borderRadius='4px';
        tooltipEl.style.fontFamily='ProximaNova';

        ///////////////////////////////
    }
    console.log(tooltipModel);

    // Hide if no tooltip
    if (tooltipModel.opacity === 0) {
        tooltipEl.style.opacity = 0;
        return;
    }

    // Set caret Position
    tooltipEl.classList.remove('above', 'below', 'no-transform');
    if (tooltipModel.yAlign) {
        tooltipEl.classList.add(tooltipModel.yAlign);
    } else {
        tooltipEl.classList.add('no-transform');
    }

    function getBody(bodyItem) {
        return bodyItem.lines;
    }

    // Set Text
    if (tooltipModel.body) {
        var titleLines = tooltipModel.title || [];
        var bodyLines = tooltipModel.body.map(getBody);

        var innerHtml = '<div>';

        titleLines.forEach(function(title) {
            innerHtml += '<span class="tooltip_title">' + title + '</span>';
        });
        innerHtml += '</div><div>';

        bodyLines.forEach(function(body, i) {
            var colors = tooltipModel.labelColors[i];
            var style = 'background:' + colors.backgroundColor;
            style += '; border-color:' + colors.borderColor;
            style += '; border-width: 2px';
            innerHtml += '<span class="tooltip_body">'  + body + '</span>';
        });
        innerHtml += '</div>';

        var tableRoot = tooltipEl.querySelector('div:first-of-type');
        tableRoot.innerHTML = innerHtml;
    }

    tooltipEl.querySelector('.tooltip_title').style.fontSize=tooltipModel.titleFontSize + 'px';
    tooltipEl.querySelector('.tooltip_body').style.fontSize=tooltipModel.bodyFontSize + 'px';
    tooltipEl.querySelector('.tooltip_body').style.fontWeight='500';


    // `this` will be the overall tooltip
    var position = this._chart.canvas.getBoundingClientRect();

    // Display, position, and set styles for font
    tooltipEl.style.opacity = 1;
    tooltipEl.style.left = position.left + tooltipModel.caretX + 'px';
    tooltipEl.style.top = position.top + tooltipModel.caretY + 'px';
    tooltipEl.style.fontFamily = tooltipModel._fontFamily;
    tooltipEl.style.fontSize = tooltipModel.fontSize;
    tooltipEl.style.fontStyle = tooltipModel._fontStyle;
    tooltipEl.style.padding = tooltipModel.yPadding + 'px ' + tooltipModel.xPadding + 'px';
};