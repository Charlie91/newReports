import moment from "moment/moment";


export const customLabel = function(tooltipModel) {
    // Tooltip Element


    // Tooltip Element
    var tip = document.getElementById('chartjs-tooltip');
    if(tip) tip.remove();
    var tip2 = document.getElementById('chartjs-tooltip2');
    if(tip2) tip2.remove();

    // Create element on first render
    var tooltipEl = document.createElement('div');
    tooltipEl.id = 'chartjs-tooltip';
    tooltipEl.innerHTML = "<div></div>";
    document.body.appendChild(tooltipEl);
    //////////////////////////////
    tooltipEl.style.position='absolute';
    tooltipEl.style.textAlign='center';


    // Hide if no tooltip
    if (tooltipModel.opacity === 0) {
        tooltipEl.remove();
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

        var innerHtmlTitle = '<div class="tooltip_title">';

        titleLines.forEach(function(title) {

            innerHtmlTitle += '<span>' + title + '</span>';
        });
        innerHtmlTitle += '</div>';

        let innerHtmlBody = '<div class="tooltip_body">';
        bodyLines.forEach(function(body, i) {
            innerHtmlBody += '<span>'  + body + '</span>';
        });
        innerHtmlBody += '</div>';

        var tableRoot = tooltipEl.querySelector('div:first-of-type');
        tableRoot.innerHTML = innerHtmlTitle + innerHtmlBody;
    }

    var position = this._chart.canvas.getBoundingClientRect();
    var scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;
    var scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    tooltipEl.style.left = (position.left + scrollLeft + tooltipModel.caretX - (tooltipEl.offsetWidth/2) ) + 'px';
    tooltipEl.style.top = (position.top + scrollTop + tooltipModel.caretY -53) + 'px';
    tooltipEl.style.display = 'block';
    tooltipEl.style.opacity = 1;
};