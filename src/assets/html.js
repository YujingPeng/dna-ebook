export const tmpl = (htmlStr) => `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Document</title>

    <style>
        body {
            overflow: hidden
        }

        #mode {
            overflow: hidden;
            height: 100%;
            width: 100%;
            position: absolute;
            top: 0;
            left: 0;
        }
        #content {
            overflow-y: hidden;
            word-wrap: break-word;
        }

        #footer {
            height: 16px;
            line-height: 16px;
            text-align: right;
            position: absolute;
            bottom: 0;
            left: 0;
            width: 100%;
            z-index: 2;
            background-color: #bfbfbf;
            display: inline-block;
        }

        #footer_content {
            font-size: 16px;
            margin-right: 16px;
        }
    </style>
</head>
<body>
    <div id="mode"></div>
    <div id="content">
        ${htmlStr}
    </div>
    <div id="footer">
        <span id="footer_content">1/5</span>
    </div>
    <script>
      var content = document.getElementById('content');
      var mode = document.getElementById('mode');
      var footer_content = document.getElementById('footer_content');
      var pageIndex = 0;
      var total = Math.ceil(content.clientHeight / mode.clientHeight);
      footer_content.innerText = (pageIndex + 1) + ' / ' + total;
      mode.addEventListener('click', function () {
          pageIndex++;
          const marginTop = (mode.clientHeight -  30) * -pageIndex ;
          if (marginTop + content.clientHeight < 0) {
              window.postMessage('end');
          } else {
              content.style.marginTop = marginTop + 'px';
              footer_content.innerText = (pageIndex + 1) + ' / ' + total;
          }
      }, true);
    </script>
</body>

</html>`;
