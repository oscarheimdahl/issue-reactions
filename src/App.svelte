<script lang="ts">
  let loadedComments = 0;
  let foundReactions = $state(
    new Array<{
      reactions: Array<{ emoji: string; count: number }>;
      id: string;
      commentId: string;
    }>()
  );

  const observer = new MutationObserver(() => {
    const comments = document.querySelectorAll(
      '[data-testid^="comment-viewer-outer-box"]'
    );
    const newLoadedComments = comments.length;

    if (loadedComments >= newLoadedComments) return;
    loadedComments = newLoadedComments;

    findReactions(comments);
    // buildSidebarContent();
  });

  observer.observe(document.body, { childList: true, subtree: true });

  function buildContentBox() {
    const div = document.createElement('div');
    div.style.margin = '0.5rem';
    div.style.paddingTop = '0.5rem';
    div.style.borderTop = '1px solid var(--borderColor-muted)';

    return div;
  }

  function findReactions(comments: NodeListOf<Element>) {
    foundReactions = [];

    comments.forEach((comment) => {
      const commentIdDiv = comment.querySelector('[id^="issuecomment"]');
      const commentId = commentIdDiv?.id ?? '';
      const reactions = comment.querySelectorAll('[aria-label="Reactions"]');
      reactions.forEach((bar) => {
        const id = `reaction-${foundReactions.length + 1}`;
        bar.setAttribute('data-id', id);
        const emojisButtons = bar.querySelectorAll('button');

        emojisButtons.forEach((emojiButton, i) => {
          if (i === 0) return; // Ignore 'new reaction' button
          const label = emojiButton.ariaLabel ?? '';
          const previousReactions = foundReactions.find(
            (reactions) => reactions.id === id
          );
          const [emoji, count] = label.split(' ');
          const reaction = { emoji, count: parseInt(count, 10) };
          if (previousReactions) previousReactions.reactions.push(reaction);
          else foundReactions.push({ reactions: [reaction], id, commentId }); // create new
        });
      });
    });
  }
</script>

<div class="reaction-column">
  {#each foundReactions as reaction}
    <a href={'#' + reaction.commentId} class="reaction-row">
      {#each reaction.reactions as r}
        <div class="reaction">{r.emoji} {r.count}</div>
      {/each}
    </a>
  {/each}
</div>

<style>
  .reaction-column {
    margin: 0.5rem;
    padding-top: 0.5rem;
    border-top: 1px solid var(--borderColor-muted);
    display: flex;
    flex-direction: column;
    gap: 0.3rem;
  }

  .reaction-row {
    display: flex;
    gap: 0.2rem;
    text-decoration: none;
  }

  .reaction-row:hover .reaction {
    /* border-color: var(--button-default-fgColor-rest, var(--color-btn-text)); */
    transform: translateX(-5px);
  }

  .reaction {
    transition: transform 0.2s;
    border: 1px solid;
    border-color: var(--borderColor-default, currentColor);
    border-radius: 99999px;
    padding: 0.2rem 0.5rem;
    font-size: var(--text-body-size-small, 0.75rem);
    font-weight: var(--base-text-weight-medium, 500);
    color: var(--button-default-fgColor-rest, var(--color-btn-text));
  }
</style>
