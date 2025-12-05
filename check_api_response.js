async function main() {
  try {
    const res = await fetch('http://localhost:3000/api/services');
    const data = await res.json();
    const resumeService = data.find(s => s.category === 'Resume Templates');
    console.log('Resume Service from API:', JSON.stringify(resumeService, null, 2));
  } catch (e) {
    console.error(e);
  }
}

main();
