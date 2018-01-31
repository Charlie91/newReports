import moment from "moment/moment";


export const customLabel3 = function(tooltipModel) {


    // Tooltip Element
    var tip = document.getElementById('chartjs-tooltip_small');
    if(tip) tip.remove();
    var tip2 = document.getElementById('chartjs-tooltip2_small');
    if(tip2) tip2.remove();

    // Create element on first render
    var tooltipEl = document.createElement('div');
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

        let innerHtmlTitle = '';
        titleLines.forEach(function(title) {
            if ( title.length < 11 ){
                tooltipEl.id = 'chartjs-tooltip2_small';
            } else {
                innerHtmlTitle += '<div class="tooltip_title">';
                tooltipEl.id = 'chartjs-tooltip_small';
                innerHtmlTitle += '<span>' +  moment(title).format("HH:mm, DD MMM") + '</span>';
                innerHtmlTitle += '</div>';
            }
        });

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
    console.log(position.left);
    console.log(scrollLeft);
    console.log(tooltipModel.caretX);
    let tool_left = position.left + scrollLeft + tooltipModel.caretX + tooltipEl.offsetWidth + 2;
    let window_width = window.innerWidth;

    if(tool_left < window_width){
        tooltipEl.style.left = (position.left + scrollLeft + tooltipModel.caretX + 2) + 'px';
    } else {
        tooltipEl.style.left = (position.left + scrollLeft + tooltipModel.caretX - 2 - tooltipEl.offsetWidth) + 'px';
    }
    tooltipEl.style.top = (position.top + scrollTop + tooltipModel.caretY - tooltipEl.clientHeight) - 8 + 'px';
    tooltipEl.style.display = 'block';
    tooltipEl.style.opacity = 1;
};