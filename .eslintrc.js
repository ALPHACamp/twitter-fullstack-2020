module.exports = {
  extends: 'airbnb-base',
  rules  : {
    indent: [
      'error',
      2,
      {
        MemberExpression  : 0,
        VariableDeclarator: 'first',
      },
    ],
    'key-spacing': [
      'error', {
        multiLine: {
          beforeColon: false,
          afterColon : true,
        },
        align: {
          beforeColon: false,
          afterColon : true,
          on         : 'colon',
        },
      },
    ],
  },
};
