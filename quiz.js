const byId = id => document.getElementById(id);
let order, current, score, answered;
function shuffle(items) {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}
function showQuestion(focus = false) {
  answered = false;
  const item = order[current];
  byId('progress-text').textContent = `Question ${current + 1} of ${order.length}`;
  byId('hint').textContent = `Hint: ${item.hint}`;
  const blank = document.createElement('span');
  blank.className = 'blank';
  blank.textContent = '___';
  blank.setAttribute('aria-label', 'blank');
  byId('question-title').replaceChildren(blank, document.createTextNode(item.sentence.slice(3)));
  byId('feedback').replaceChildren();
  byId('feedback').className = '';
  byId('next').hidden = true;
  byId('choices').replaceChildren();
  shuffle(item.choices).forEach(choice => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'choice';
    button.lang = 'es';
    button.textContent = choice;
    button.addEventListener('click', () => grade(choice));
    byId('choices').append(button);
  });
  if (focus) byId('question-title').focus();
}
function grade(choice) {
  if (answered) return;
  answered = true;
  const item = order[current];
  const correct = choice === item.answer;
  if (correct) score++;
  byId('score').textContent = `Score: ${score} / ${current + 1}`;
  byId('progress').value = current + 1;
  [...byId('choices').children].forEach(button => {
    button.disabled = true;
    if (button.textContent === item.answer) button.classList.add('correct');
    else if (button.textContent === choice) button.classList.add('incorrect');
  });
  const completed = document.createElement('p');
  completed.lang = 'es';
  completed.textContent = item.sentence.replace('___', item.answer);
  const explanation = document.createElement('p');
  explanation.textContent = item.explanation;
  byId('feedback').replaceChildren(document.createTextNode(correct ? 'Correct! +1 point.' : `Not quite. The answer is ${item.answer}. +0 points.`), completed, explanation);
  byId('feedback').className = correct ? '' : 'wrong';
  byId('next').textContent = current === order.length - 1 ? 'See results →' : 'Next question →';
  byId('next').hidden = false;
  byId('next').focus();
}
byId('next').addEventListener('click', () => {
  if (!answered) return;
  current++;
  if (current < order.length) return showQuestion(true);
  byId('question-area').hidden = true;
  byId('results').hidden = false;
  byId('progress-text').textContent = `${order.length} of ${order.length} answered`;
  byId('result-score').textContent = `You scored ${score} out of ${order.length} (${Math.round(score / order.length * 100)}%).`;
  byId('result-title').focus();
});
function restart(focus = false) {
  order = shuffle(questions);
  current = 0;
  score = 0;
  byId('score').textContent = 'Score: 0 / 0';
  byId('progress').value = 0;
  byId('results').hidden = true;
  byId('question-area').hidden = false;
  showQuestion(focus);
}
byId('restart').addEventListener('click', () => restart(true));
restart();
