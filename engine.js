"format cjs";

var wrap = require('word-wrap');
var map = require('lodash.map');
var longest = require('longest');
var rightPad = require('right-pad');

var filter = function(array) {
  return array.filter(function(x) {
    return x;
  });
};

// This can be any kind of SystemJS compatible module.
// We use Commonjs here, but ES6 or AMD would do just
// fine.
module.exports = function (options) {
  
  var types = options.types;

  var length = longest(Object.keys(types)).length + 1;
  // var choices = map(types, function (type, key) {
  //   return {
  //     name: rightPad(key + ':', length) + ' ' + type.description,
  //     value: key
  //   };
  // });
  var choices = [{ name: 'feat:     新功能提交(new feature)', value: 'feat' },
  { name: 'fix:      修正Bug提交(bug fix)', value: 'fix' },
  { name: 'docs:     文档类提交(Documentation only changes)', value: 'docs' },
  { name: 'style:    格式类提价(Changes regarding code formart (white-space, formatting, etc))',
    value: 'style' },
  { name: 'refactor: 重构类提交(A code change that neither fixes a bug nor adds a feature)',
    value: 'refactor' },
  { name: 'perf:     性能类提交(A code change that improves performance)',
    value: 'perf' },
  { name: 'test:     测试类提交(Adding missing tests or correcting existing tests)',
    value: 'test' },
  { name: 'build:    构建类提交(Changes that affect the build system or external dependencies (eg: webpack, npm))',
    value: 'build' },
  { name: 'ci:       CI类提交(Changes to our CI configuration files and scripts (eg: Travis, Circle)',
    value: 'ci' },
  { name: 'chore:    其它类型提交,无关src目录以及test目录(Other changes that don\'t modify src or test files)',
    value: 'chore' },
  { name: 'revert:   代码回退提交(Reverts a previous commit)', value: 'revert' }];
  console.log(choices)
  return {
    // When a user runs `git cz`, prompter will
    // be executed. We pass you cz, which currently
    // is just an instance of inquirer.js. Using
    // this you can ask questions and get answers.
    //
    // The commit callback should be executed when
    // you're ready to send back a commit template
    // to git.
    //
    // By default, we'll de-indent your commit
    // template and will keep empty lines.
    prompter: function(cz, commit) {
      console.log('\nLine 1 will be cropped at 100 characters. All other lines will be wrapped after 100 characters.\n');
      // console.log('\n注意! 只有:新功能,Bug修正和填写的重大变化才会出现在changelog.md文件中\n');

      // Let's ask some questions of the user
      // so that we can populate our commit
      // template.
      //
      // See inquirer.js docs for specifics.
      // You can also opt to use another input
      // collection library if you prefer.
      cz.prompt([
        {
          type: 'list',
          name: 'type',
          message: '请选择本次提交的类型(必选): (Select the type of change that you\'re committing)',
          choices: choices
        }, {
          type: 'input',
          name: 'scope',
          message: '请输入本次commit影响的内容(选填): (Denote the scope of this change (JSX, Reducer, Service, etc.)\n'
        }, {
          type: 'input',
          name: 'subject',
          message: '请概括本次commit的内容(必填): (Write a short, imperative tense description of the change)\n'
        }, {
          type: 'input',
          name: 'body',
          message: '请输入本次commit的详细描述(选填): (Provide a longer description of the change)\n'
        }, {
          type: 'input',
          name: 'breaking',
          message: '请输入本次commit需要注意的重要信息(选填),eg:与之前版本不兼容的重要信息. (List any breaking changes)\n'
        }, {
          type: 'input',
          name: 'issues',
          message: '请输入关联的issue(可选, 格式参考 Close: #22,#33) (List any issues closed by this change)\n'
        }
      ]).then(function(answers) {

        var maxLineWidth = 100;

        var wrapOptions = {
          trim: true,
          newline: '\n',
          indent:'',
          width: maxLineWidth
        };

        // parentheses are only needed when a scope is present
        var scope = answers.scope.trim();
        scope = scope ? '(' + answers.scope.trim() + ')' : '';

        // Hard limit this line
        var head = (answers.type + scope + ': ' + answers.subject.trim()).slice(0, maxLineWidth);

        // Wrap these lines at 100 characters
        var body = wrap(answers.body, wrapOptions);

        // Apply breaking change prefix, removing it if already present
        var breaking = answers.breaking.trim();
        breaking = breaking ? 'BREAKING CHANGE: ' + breaking.replace(/^BREAKING CHANGE: /, '') : '';
        breaking = wrap(breaking, wrapOptions);

        var issues = wrap(answers.issues, wrapOptions);

        var footer = filter([ breaking, issues ]).join('\n\n');

        commit(head + '\n\n' + body + '\n\n' + footer);
      });
    }
  };
};
