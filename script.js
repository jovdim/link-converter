document.getElementById("convertBtn").addEventListener("click", convertLink);

function extractProductID(url) {
  let match, platform, rawLink;

  if (url.includes("taobao.com/item.") || url.includes("tmall.com")) {
    match = url.match(/id=(\d+)/);
    platform = "taobao";
    rawLink = `https://item.taobao.com/item.htm?id=${match[1]}`;
  } else if (url.includes("weidian.com/item")) {
    match = url.match(/itemID=(\d+)/);
    platform = "weidian";
    rawLink = `https://weidian.com/item.html?itemID=${match[1]}`;
  } else if (url.includes("1688.com/offer")) {
    match = url.match(/offer\/(\d+)\.html/);
    platform = "1688";
    rawLink = `https://detail.1688.com/offer/${match[1]}.html`;
  }

  // Detect agent links
  else if (
    url.includes("acbuy.com") ||
    url.includes("cnfans.com") ||
    url.includes("orientdig.com") ||
    url.includes("sugargoo.com") ||
    url.includes("allchinabuy.com")
  ) {
    return extractFromAgent(url);
  }

  return match
    ? { id: match[1], platform: platform, rawLink: rawLink }
    : { id: null, platform: null, rawLink: null };
}

function extractFromAgent(url) {
  let match, platform, id, rawLink;

  if (url.includes("acbuy.com")) {
    match = url.match(/id=(\d+)/);
    platform = url.includes("source=TB")
      ? "taobao"
      : url.includes("source=AL")
      ? "1688"
      : "weidian";
  } else if (url.includes("cnfans.com")) {
    match = url.match(/id=(\d+)/);
    platform = url.includes("shop_type=taobao")
      ? "taobao"
      : url.includes("shop_type=ali_1688")
      ? "1688"
      : "weidian";
  } else if (url.includes("orientdig.com")) {
    match = url.match(/id=(\d+)/);
    platform = url.includes("shop_type=taobao")
      ? "taobao"
      : url.includes("shop_type=ali_1688")
      ? "1688"
      : "weidian";
  }
  //
  else if (url.includes("sugargoo.com")) {
    match = url.match(/productLink=([^&]*)/);

    let decodedLink = decodeURIComponent(match[1]);

    match = decodedLink.match(/itemID=(\d+)/);

    platform = url.includes("taobao")
      ? "taobao"
      : url.includes("1688")
      ? "1688"
      : "weidian";
  }
  //
  else if (url.includes("allchinabuy.com")) {
    match = url.match(/url=([^&]*)/);
    let decodedLink = decodeURIComponent(match[1]);
    if (decodedLink.includes("weidian.com")) {
      match = decodedLink.match(/itemID|itemId=(\d+)/);
      platform = "weidian";
    } else if (decodedLink.includes("taobao.com")) {
      match = decodedLink.match(/id=(\d+)/);
      platform = "taobao";
    } else if (decodedLink.includes("1688.com")) {
      match = decodedLink.match(/offer\/(\d+)\.html/);
      platform = "1688";
    }

    platform = url.includes("taobao")
      ? "taobao"
      : url.includes("1688")
      ? "1688"
      : "weidian";
  }
  id = match ? match[1] : null;

  if (!id) return { id: null, platform: null, rawLink: null };

  if (platform === "taobao")
    rawLink = `https://item.taobao.com/item.htm?id=${id}`;
  else if (platform === "1688")
    rawLink = `https://detail.1688.com/offer/${id}.html`;
  else rawLink = `https://weidian.com/item.html?itemID=${id}`;

  return { id: id, platform: platform, rawLink: rawLink };
}

function copyToClipboard(button, text) {
  navigator.clipboard
    .writeText(text)
    .then(() => {
      button.textContent = "Copied!";
      setTimeout(() => (button.textContent = "Copy"), 1500);
    })
    .catch((err) => {
      console.error("Failed to copy: ", err);
    });
}

function convertLink() {
  const inputField = document.getElementById("inputLink");
  const resultDiv = document.getElementById("result");
  const inputLink = inputField.value.trim();

  if (!inputLink) {
    alert("Please enter a valid link!");
    return;
  }
  let extracted = extractProductID(inputLink);

  if (!extracted.id) {
    alert("Invalid link! Could not extract product ID.");
    return;
  }

  const { id, platform, rawLink } = extracted;
  const encodedLink = encodeURIComponent(rawLink);

  const affiliateCodes = {
    AllChinaBuy: "&partnercode=wrf7xD",
    AcBuy: "&u=9MLILB",
    CNFans: "&ref=71427",
    OrientDig: "&ref=100005658",
    Sugargoo: "&memberId=341947205705269884",
  };

  const agents = {
    "Raw Link": rawLink,
    AllChinaBuy: `https://www.allchinabuy.com/en/page/buy/?from=search-input&url=${encodedLink}${affiliateCodes.AllChinaBuy}`,
    AcBuy: `https://www.acbuy.com/product/?id=${id}&source=${
      platform === "taobao" ? "TB" : platform === "1688" ? "AL" : "WD"
    }${affiliateCodes.AcBuy}`,
    CNFans: `https://cnfans.com/product/?shop_type=${
      platform === "taobao"
        ? "taobao"
        : platform === "1688"
        ? "ali_1688"
        : "weidian"
    }&id=${id}${affiliateCodes.CNFans}`,
    OrientDig: `https://orientdig.com/product/?shop_type=${
      platform === "taobao"
        ? "taobao"
        : platform === "1688"
        ? "ali_1688"
        : "weidian"
    }&id=${id}${affiliateCodes.OrientDig}`,
    Sugargoo: `https://www.sugargoo.com/#/home/productDetail?productLink=${encodedLink}${affiliateCodes.Sugargoo}`,
  };

  resultDiv.innerHTML = "<h3>Converted Links:</h3><table>";
  resultDiv.innerHTML += "<tr><th>Agent</th><th>Link</th><th>Copy</th></tr>";

  for (const [agent, link] of Object.entries(agents)) {
    resultDiv.innerHTML += `
            <tr>
                <td><strong>${agent}</strong></td>
                <td><a href="${link}" target="_blank" class="link-style">${link}</a></td>
                <td><button class="copy-btn" onclick="copyToClipboard(this, '${link}')">Copy</button></td>
            </tr>`;
  }

  resultDiv.innerHTML + resultDiv + "</table>";
}
