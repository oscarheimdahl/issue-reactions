let content = buildContentBox();
const stickySidebar = document.querySelector('[data-testid="sticky-sidebar"]');
stickySidebar.appendChild(content);

let loadedComments = 0;
let foundReactions = [];

const observer = new MutationObserver(() => {
  const comments = document.querySelectorAll(
    '[data-testid^="comment-viewer-outer-box"]'
  );
  const newLoadedComments = comments.length;

  if (loadedComments >= newLoadedComments) return;
  loadedComments = newLoadedComments;

  findReactions(comments);
  buildSidebarContent();
});

observer.observe(document.body, { childList: true, subtree: true });

function buildContentBox() {
  const div = document.createElement('div');
  div.style.margin = '0.5rem';
  div.style.paddingTop = '0.5rem';
  div.style.borderTop = '1px solid #3d444db3';

  return div;
}

function findReactions(comments) {
  foundReactions = [];

  comments.forEach((comment) => {
    const commentIdDiv = comment.querySelector('[id^="issuecomment"]');
    const commentId = commentIdDiv.id;
    const reactions = comment.querySelectorAll('[aria-label="Reactions"]');
    reactions.forEach((bar) => {
      const id = `reaction-${foundReactions.length + 1}`;
      bar.setAttribute('data-id', id);
      const emojisButtons = bar.querySelectorAll('button');

      emojisButtons.forEach((emojiButton, i) => {
        if (i === 0) return; // Ignore 'new reaction' button
        const label = emojiButton.ariaLabel;
        const previousReactions = foundReactions.find((reactions) => {
          return reactions.id === id;
        });
        const [emoji, count] = label.split(' ');
        const reaction = { emoji, count: parseInt(count, 10) };
        if (previousReactions) previousReactions.reactions.push(reaction);
        else foundReactions.push({ reactions: [reaction], id, commentId }); // create new
      });
    });
  });
}

function buildSidebarContent() {
  content.innerHTML = '';

  foundReactions.forEach((reaction) => {
    const reactionsLink = document.createElement('a');
    reactionsLink.href = `#${reaction.commentId}`;
    reactionsLink.style.display = 'flex';
    reactionsLink.style.gap = '0.5rem';
    reactionsLink.style.color = '#9198a1';
    reaction.reactions.forEach((r) => {
      const emojiLink = document.createElement('span');
      emojiLink.textContent = `${r.emoji} ${r.count} `;
      reactionsLink.appendChild(emojiLink);
    });
    content.appendChild(reactionsLink);
  });
}
