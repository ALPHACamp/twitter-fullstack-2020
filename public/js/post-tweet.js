


async function postTweet (input) {
  try {
    const response = await fetch('/api/tweets', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ tweet: input.value })
    });

    if (response.ok) {
      // Tweet posted successfully
      const data = await response.json();
      console.log(data);
      input.value = null
      location.reload(true)
    } else {
      // Error posting tweet
      const error = await response.text();
      console.error(error);
    }
  } catch (error) {
    // Network error
    console.error(error);
  }
}
