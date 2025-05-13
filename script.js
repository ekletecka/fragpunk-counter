const lancerData = {
    lancers: [
      {
        name: "Axon",
        role: "Damage/Flanker",
        counters: ["Corona", "Spider", "Nitro"],
        counteredBy: ["Hollowpoint", "Sonar", "Pathojen"]
      },
      {
        name: "Broker",
        role: "Damage/Control",
        counters: ["Hollowpoint", "Zephyr", "Sonar"],
        counteredBy: ["Pathojen", "Corona", "Jaguar"]
      },
      {
        name: "Chum",
        role: "Control/Area Denial",
        counters: ["Zephyr", "Serket", "Kismet"],
        counteredBy: ["Hollowpoint", "Broker", "Sonar"]
      },
      {
        name: "Corona",
        role: "Damage/Disruptor",
        counters: ["Broker", "Nitro", "Zephyr"],
        counteredBy: ["Axon", "Pathojen", "Hollowpoint"]
      },
      {
        name: "Hollowpoint",
        role: "Damage/Recon",
        counters: ["Zephyr", "Serket", "Kismet"],
        counteredBy: ["Jaguar", "Broker", "Corona"]
      },
      {
        name: "Jaguar",
        role: "Control/Flanker",
        counters: ["Hollowpoint", "Pathojen", "Zephyr"],
        counteredBy: ["Serket", "Nitro", "Broker"]
      },
      {
        name: "Kismet",
        role: "Damage/Flanker",
        counters: ["Pathojen", "Chum", "Sonar"],
        counteredBy: ["Hollowpoint", "Jaguar", "Nitro"]
      },
      {
        name: "Nitro",
        role: "Control/Defense",
        counters: ["Zephyr", "Serket", "Kismet"],
        counteredBy: ["Axon", "Broker", "Corona"]
      },
      {
        name: "Pathojen",
        role: "Support/Control",
        counters: ["Broker", "Axon", "Corona"],
        counteredBy: ["Kismet", "Hollowpoint", "Sonar"]
      },
      {
        name: "Serket",
        role: "Flanker/Support",
        counters: ["Jaguar", "Chum", "Nitro"],
        counteredBy: ["Hollowpoint", "Sonar", "Zephyr"]
      },
      {
        name: "Sonar",
        role: "Control/Recon",
        counters: ["Zephyr", "Kismet", "Serket"],
        counteredBy: ["Broker", "Chum", "Pathojen"]
      },
      {
        name: "Spider",
        role: "Support/Mobility",
        counters: ["Pathojen", "Corona", "Broker"],
        counteredBy: ["Axon", "Hollowpoint", "Sonar"]
      },
      {
        name: "Zephyr",
        role: "Flanker/Stealth",
        counters: ["Nitro", "Broker", "Chum"],
        counteredBy: ["Hollowpoint", "Sonar", "Jaguar"]
      }
    ]
  };
  
  // Populate dropdowns with Lancer names
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