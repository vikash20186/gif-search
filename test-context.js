var context = require.context('./src/test-specs', true, /-spec\.js$/);
context.keys().forEach(context);