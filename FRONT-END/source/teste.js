function hifenName(name) {
  const nameString = name.split("");
  nameString.forEach((char, index) => {
    if (char === "(") {
      nameString.splice(index);
    }
  });

  return nameString.join("").trim().split(" ").join("-");
}

console.log(hifenName("MERCADO IRMAOS BERNARDI LTDA (2 PONTO BRUNA)"));