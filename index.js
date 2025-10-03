// Load entries from localStorage
window.onload = function() {
  const savedEntries = JSON.parse(localStorage.getItem('diaryEntries')) || [];
  savedEntries.forEach(entry => displayEntry(entry));
};

function toggleEmoji(el) {
  el.classList.toggle('selected');
}

function addEntry() {
  const title = document.getElementById('title').value;
  const content = document.getElementById('content').value;
  const selectedEmojis = Array.from(document.querySelectorAll('.emoji-selector .selected'))
                              .map(e => e.textContent);

  const imageFiles = document.getElementById('images').files;

  if (!title || !content) {
    alert('Please fill in title and content!');
    return;
  }

  // Convert images to Base64
  const imagePromises = Array.from(imageFiles).map(file => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.readAsDataURL(file);
    });
  });

  Promise.all(imagePromises).then(images => {
    const entry = {
      title,
      content,
      emojis: selectedEmojis,
      images,
      date: new Date().toLocaleString()
    };

    // Save to localStorage
    const savedEntries = JSON.parse(localStorage.getItem('diaryEntries')) || [];
    savedEntries.unshift(entry);
    localStorage.setItem('diaryEntries', JSON.stringify(savedEntries));

    // Display on page
    displayEntry(entry, true);

    // Clear inputs
    document.getElementById('title').value = '';
    document.getElementById('content').value = '';
    document.getElementById('images').value = '';
    document.querySelectorAll('.emoji-selector .selected').forEach(e => e.classList.remove('selected'));
  });
}

function displayEntry(entry, prepend = false) {
  const entryDiv = document.createElement('div');
  entryDiv.className = 'diary-entry';

  // Entry text
  const contentDiv = document.createElement('div');
  contentDiv.className = 'entry-content';
  contentDiv.innerHTML = `
    <strong>${entry.title}</strong> <em style="font-size:0.9rem;color:#666">(${entry.date})</em><br>
    ${entry.content}<br>
    <em>${entry.emojis.join(' ')}</em>
  `;

  // Entry images
  const imagesDiv = document.createElement('div');
  imagesDiv.className = 'entry-images';
  entry.images.forEach(src => {
    const img = document.createElement('img');
    img.src = src;
    imagesDiv.appendChild(img);
  });

  entryDiv.appendChild(contentDiv);
  if (entry.images.length > 0) entryDiv.appendChild(imagesDiv);

  const container = document.getElementById('entries');
  if (prepend) {
    container.prepend(entryDiv);
  } else {
    container.appendChild(entryDiv);
  }
}
