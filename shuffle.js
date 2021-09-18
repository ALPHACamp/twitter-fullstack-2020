module.exports =
  function shuffle(n, m) {
    const array = Array.from({ length: n }).map((d, i) => i)
    var i = n,
      j = 0,
      temp;

    while (i--) {

      j = Math.floor(Math.random() * (i + 1));

      // swap randomly chosen element with current element
      temp = array[i];
      array[i] = array[j];
      array[j] = temp;

    }

    return array.splice(0, m);
  }
