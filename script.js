const lancerData = {
    lancers: [
      { name: "Axon", role: "Damage/Flanker", counters: ["Corona", "Spider", "Nitro"], counteredBy: ["Hollowpoint", "Sonar", "Pathojen"] },
      { name: "Broker", role: "Damage/Control", counters: ["Hollowpoint", "Zephyr", "Sonar"], counteredBy: ["Pathojen", "Corona", "Jaguar"] },
      { name: "Chum", role: "Control/Area Denial", counters: ["Zephyr", "Serket", "Kismet"], counteredBy: ["Hollowpoint", "Broker", "Sonar"] },
      { name: "Corona", role: "Damage/Disruptor", counters: ["Broker", "Nitro", "Zephyr"], counteredBy: ["Axon", "Pathojen", "Hollowpoint"] },
      { name: "Dex", role: "Flanker/Support", counters: ["Hollowpoint", "Zephyr", "Broker"], counteredBy: ["Sonar", "Pathojen", "Corona"] },
      { name: "Hollowpoint", role: "Damage/Recon", counters: ["Zephyr", "Serket", "Kismet"], counteredBy: ["Jaguar", "Broker", "Corona"] },
      { name: "Jaguar", role: "Control/Flanker", counters: ["Hollowpoint", "Pathojen", "Zephyr"], counteredBy: ["Serket", "Nitro", "Broker"] },
      { name: "Kismet", role: "Damage/Flanker", counters: ["Pathojen", "Chum", "Sonar"], counteredBy: ["Hollowpoint", "Jaguar", "Nitro"] },
      { name: "Nitro", role: "Control/Defense", counters: ["Zephyr", "Serket", "Kismet"], counteredBy: ["Axon", "Broker", "Corona"] },
      { name: "Pathojen", role: "Support/Control", counters: ["Broker", "Axon", "Corona"], counteredBy: ["Kismet", "Hollowpoint", "Sonar"] },
      { name: "Serket", role: "Flanker/Support", counters: ["Jaguar", "Chum", "Nitro"], counteredBy: ["Hollowpoint", "Sonar", "Zephyr"] },
      { name: "Sonar", role: "Control/Recon", counters: ["Zephyr", "Kismet", "Serket"], counteredBy: ["Broker", "Chum", "Pathojen"] },
      { name: "Spider", role: "Support/Mobility", counters: ["Pathojen", "Corona", "Broker"], counteredBy: ["Axon", "Hollowpoint", "Sonar"] },
      { name: "Zephyr", role: "Flanker/Stealth", counters: ["Nitro", "Broker", "Chum"], counteredBy: ["Hollowpoint", "Sonar", "Jaguar"] }
    ],
    maps: [
      {
        name: "Akhet",
        recommendedLancers: [
          { name: "Hollowpoint", reason: "Meteora railgun dominates long alleys." },
          { name: "Corona", reason: "Flashbang and dash excel in tight alleys." },
          { name: "Jaguar", reason: "Traps and tracking suit close-quarters duels." }
        ]
      },
      {
        name: "Blackmarket",
        recommendedLancers: [
          { name: "Hollowpoint", reason: "Railgun locks down wide streets." },
          { name: "Broker", reason: "Rocket launcher clears alleys and sites." },
          { name: "Zephyr", reason: "Invisibility aids flanking in alleys." }
        ]
      },
      {
        name: "Naos",
        recommendedLancers: [
          { name: "Corona", reason: "Flashbang and dash dominate courtyards." },
          { name: "Serket", reason: "Teleportation controls tight hallways." },
          { name: "Kismet", reason: "Scans expose enemies in close fights." }
        ]
      },
      {
        name: "Outpost",
        recommendedLancers: [
          { name: "Pathojen", reason: "Healing supports open and enclosed fights." },
          { name: "Nitro", reason: "Drone and wall fortify site defenses." },
          { name: "Axon", reason: "Mobility suits aggressive flanks." }
        ]
      },
      {
        name: "Tundra",
        recommendedLancers: [
          { name: "Hollowpoint", reason: "Railgun controls long sightlines." },
          { name: "Sonar", reason: "Echolocation reveals enemies across paths." },
          { name: "Jaguar", reason: "Traps secure close-quarters sites." }
        ]
      },
      {
        name: "Garden",
        recommendedLancers: [
          { name: "Zephyr", reason: "Invisibility excels in chaotic fights." },
          { name: "Serket", reason: "Teleportation disrupts open areas." },
          { name: "Corona", reason: "Dash and fire zones thrive in fast combat." }
        ]
      }
    ]
  };
  
  // Populate Lancer dropdowns
  document.addEventListener("DOMContentLoaded", () => {
    const dropdowns = ["enemy1", "enemy2", "enemy3", "enemy4", "enemy5"];
    dropdowns.forEach(id => {
      const select = document.getElementById(id);
      lancerData.lancers.forEach(lancer => {
        const option = document.createElement("option");
        option.value = lancer.name;
        option.textContent = lancer.name;
        select.appendChild(option);
      });
    });
  });
  
  // Calculate counter-picks
  function getCounterPicks() {
    const enemyPicks = [
      document.getElementById("enemy1").value,
      document.getElementById("enemy2").value,
      document.getElementById("enemy3").value,
      document.getElementById("enemy4").value,
      document.getElementById("enemy5").value
    ];
  
    if (enemyPicks.some(pick => !pick)) {
      alert("Please select all enemy Lancers.");
      return;
    }
  
    const scores = lancerData.lancers.map(lancer => {
      let score = 0;
      enemyPicks.forEach(enemy => {
        if (lancer.counters.includes(enemy)) score += 1;
        if (lancer.name === enemy) score = -Infinity;
      });
      return { name: lancer.name, role: lancer.role, score };
    });
  
    const sorted = scores.sort((a, b) => b.score - a.score);
    const recommended = [];
    const rolesNeeded = ["Support", "Damage", "Control"];
    let rolesFilled = [];
  
    for (let lancer of sorted) {
      if (recommended.length < 5 && !enemyPicks.includes(lancer.name)) {
        recommended.push(lancer);
        rolesFilled.push(lancer.role.split("/")[0]);
      }
      if (recommended.length === 5) break;
    }
  
    const resultsDiv = document.getElementById("results");
    resultsDiv.innerHTML = "<h3>Recommended Team</h3><ul>";
    recommended.forEach(lancer => {
      const counters = lancerData.lancers.find(l => l.name === lancer.name).counters
        .filter(enemy => enemyPicks.includes(enemy));
      resultsDiv.innerHTML += `<li><strong>${lancer.name}</strong> (${lancer.role}): Counters ${counters.join(", ") || "none directly"} (Score: ${lancer.score})</li>`;
    });
    resultsDiv.innerHTML += "</ul>";
  }
  
  // Display map recommendations
  function getMapRecommendations() {
    const mapSelect = document.getElementById("map-select").value;
    const resultsDiv = document.getElementById("map-results");
  
    if (!mapSelect) {
      alert("Please select a map.");
      return;
    }
  
    const mapData = lancerData.maps.find(map => map.name === mapSelect);
    resultsDiv.innerHTML = `<h3>Recommended Lancers for ${mapSelect}</h3><ul>`;
    mapData.recommendedLancers.forEach(lancer => {
      resultsDiv.innerHTML += `<li><strong>${lancer.name}</strong>: ${lancer.reason}</li>`;
    });
    resultsDiv.innerHTML += "</ul>";
  }