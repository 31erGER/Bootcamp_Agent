WB.register({
  id: 'FIXTURE_OK',
  parts: [{ tasks: [{
    id: 1,
    type: 'result',
    fields: [{ kind: 'number', answer: 1, tol: 0 }],
    verify: [{ field: 0, kind: 'modPow', args: [3, 4, 5] }]
  }] }]
});
