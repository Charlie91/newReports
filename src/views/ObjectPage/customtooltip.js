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

        ///////////////////////////////
    }

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

        var innerHtml = '<div class="tooltip_title">';

        titleLines.forEach(function(title) {
            innerHtml += '<span>' + title + '</span>';
        });
        innerHtml += '</div><div class="tooltip_body">';

        bodyLines.forEach(function(body, i) {
            innerHtml += '<span>'  + body + '</span>';
        });
        innerHtml += '</div>';

        var tableRoot = tooltipEl.querySelector('div:first-of-type');
        tableRoot.innerHTML = innerHtml;
    }

    // `this` will be the overall tooltip
    var position = this._chart.canvas.getBoundingClientRect();
    var scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;
    var scrollTop = window.pageYOffset || document.documentElement.scrollTop;


    // Display, position, and set styles for font
    tooltipEl.style.opacity = 1;
    tooltipEl.style.left = (position.left + scrollLeft + tooltipModel.caretX -50) + 'px';
    tooltipEl.style.top = (position.top + scrollTop + tooltipModel.caretY -51) + 'px';
};