<body>
  <h1>{{title}}</h1>
  <p>循环：</p>
  <ul>
    {% for key,value in food %}
      <li>{{key}} -  {{value}}</li>
    {%endfor%}
  </ul>
</body>