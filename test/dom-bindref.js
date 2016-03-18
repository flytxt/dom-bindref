(function(document) {
  window.app = document.querySelector('#app');
  var app = window.app;

  app.item = {
    key: 'value'
  };

  app.tree = {
    rows: [{
      leaf: true,
      value: 1
    }, {
      cols: [{
        leaf: true,
        value: 2
      }, {
        rows: [{
          leaf: true,
          value: 3
        }, {
          leaf: true,
          value: 4
        }]
      }]
    }]
  };
})(document);

/* globals app */

describe('dom-bindref', function() {

  it('reference to simple template', function() {
    var span = document.querySelector('#simple-bindref span');
    expect(span.textContent).to.equal('I\'m content inside ref1 template!');
  });

  it('reference template with bound object', function() {
    var span = document.querySelector('#bindref span');
    expect(span.textContent).to.equal('value');
  });

  it('reference template with bound object and verify object change', function() {
    var span = document.querySelector('#bindref span');
    expect(span.textContent).to.equal('value');
    app.item = {
      key: 'value2'
    };
    span = document.querySelector('#bindref span');
    expect(span.textContent).to.equal('value2');
  });

  it('reference recursive template', function() {
    var rows, cols, leaves;

    rows = document.querySelectorAll('#bindref-recursive .row');
    expect(rows.length).to.equal(4);

    leaves = rows[0].querySelectorAll('.leaf');
    expect(leaves.length).to.equal(1);
    expect(leaves[0].textContent).to.equal('1');

    cols = rows[1].querySelectorAll('.col');
    expect(cols.length).to.equal(2);

    leaves = cols[0].querySelectorAll('.leaf');
    expect(leaves.length).to.equal(1);
    expect(leaves[0].textContent).to.equal('2');

    rows = cols[1].querySelectorAll('.row');
    expect(rows.length).to.equal(2);

    _.forEach(rows, function(row, index) {
      leaves = row.querySelectorAll('.leaf');
      expect(leaves.length).to.equal(1);
      expect(leaves[0].textContent).to.equal(String(3 + index));
    });
  });

  it('reference recursive template and verify change in bound object', function(done) {
    app.set('tree', {
      cols: [{
        leaf: true,
        value: 1
      }, {
        rows: [{
          leaf: true,
          value: 2
        }, {
          cols: [{
            leaf: true,
            value: 3
          }, {
            leaf: true,
            value: 4
          }]
        }]
      }]
    });

    setTimeout(function() {
      var rows, cols, leaves;
      cols = document.querySelectorAll('#bindref-recursive .col');
      expect(cols.length).to.equal(4);

      leaves = cols[0].querySelectorAll('.leaf');
      expect(cols.length).to.equal(4);
      expect(leaves.length).to.equal(1);
      expect(leaves[0].textContent).to.equal('1');

      rows = cols[1].querySelectorAll('.row');
      expect(rows.length).to.equal(2);

      leaves = rows[0].querySelectorAll('.leaf');
      expect(leaves.length).to.equal(1);
      expect(leaves[0].textContent).to.equal('2');

      cols = rows[1].querySelectorAll('.col');
      expect(cols.length).to.equal(2);

      _.forEach(cols, function(col, index) {
        leaves = col.querySelectorAll('.leaf');
        expect(leaves.length).to.equal(1);
        expect(leaves[0].textContent).to.equal(String(3 + index));
      });
      done();
    });
  });
});
