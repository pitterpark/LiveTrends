import axios from "axios";
// async await

const InfoTag = [
  ["title", "<title>", "</title>"],
  ["description", "<description>", "</description>"],
  ["link", "<link>", "</link>"],
];

const TagInItem = [
  ["title", "<title>", "</title>"],
  ["approx_traffic", "<ht:approx_traffic>", "</ht:approx_traffic>"],
  ["description", "<description>", "</description>"],
  ["link", "<link>", "</link>"],
  ["pubDate", "<pubDate>", "</pubDate>"],
  ["picture", "<ht:picture>", "</ht:picture>"],
  ["picture_source", "<ht:picture_source>", "</ht:picture_source>"],
];

const TagInNewItem = [
  ["news_title", "<ht:news_item_title>", "</ht:news_item_title>"],
  ["news_snippet", "<ht:news_item_snippet>", "</ht:news_item_snippet>"],
  ["news_url", "<ht:news_item_url>", "</ht:news_item_url>"],
  ["news_source", "<ht:news_item_source>", "</ht:news_item_source>"],
];

export async function getTrend(location) {
  let res = { items: [] };
  let response = await axios.get(
    `/trends/trendingsearches/daily/rss?geo=${location}`
  );

  InfoTag.forEach((e) => {
    res[e[0]] = response.data.substring(
      response.data.indexOf(e[1]) + e[1].length,
      response.data.indexOf(e[2])
    );
  });

  while (true) {
    if (response.data.includes("<item>") && response.data.includes("</item>")) {
      let itemObject = {};
      let newsItems = [];

      //items를 파싱
      let itemString = response.data.substring(
        response.data.indexOf("<item>") + 6,
        response.data.indexOf("</item>") + 6
      );

      //response에서 삭제
      response.data = response.data.replace(
        response.data.substring(
          response.data.indexOf("<item>"),
          response.data.indexOf("</item>") + 6
        ),
        ""
      );

      //item 요소 분리
      TagInItem.forEach((e) => {
        itemObject[e[0]] = itemString.substring(
          itemString.indexOf(e[1]) + e[1].length,
          itemString.indexOf(e[2])
        );
      });

      //news items 파싱
      while (true) {
        if (
          itemString.includes("<ht:news_item>") &&
          itemString.includes("</ht:news_item>")
        ) {
          let newsItemObject = {};

          let newsItem = itemString.substring(
            itemString.indexOf("<ht:news_item>") + 15,
            itemString.indexOf("</ht:news_item>") + 15
          );
          itemString = itemString.replace(
            itemString.substring(
              itemString.indexOf("<ht:news_item>"),
              itemString.indexOf("</ht:news_item>") + 15
            )
          );

          //news item의 요소 분리
          TagInNewItem.forEach((e) => {
            newsItemObject[e[0]] = newsItem.substring(
              newsItem.indexOf(e[1]) + e[1].length,
              newsItem.indexOf(e[2])
            );
          });
          newsItems.push(newsItemObject);
        } else {
          break;
        }
      }

      itemObject["news_items"] = newsItems;
      res["items"].push(itemObject);
    } else {
      break;
    }
  }
  return res;
}

// <title>동지</title>
// <ht:approx_traffic>10,000+</ht:approx_traffic>
// <description></description>
// <link>https://trends.google.com/trends/trendingsearches/daily?geo=KR#%EB%8F%99%EC%A7%80</link>
// <pubDate>Wed, 22 Dec 2021 09:00:00 +0900</pubDate>
// <ht:picture>https://t2.gstatic.com/images?q=tbn:ANd9GcTu4BjMFWUHa3eyGYaHI7oevA-JE34b6FBv0M4EfWwkXx8vzkQlcogOHQNsYz9MYw1oDHsLlQ66</ht:picture>
// <ht:picture_source>매일경제</ht:picture_source>
// <ht:news_item>
//   <ht:news_item_title>[오늘은] 팥죽 먹고 한살 더 먹는 날 &amp;#39;동지&amp;#39;</ht:news_item_title>
//   <ht:news_item_snippet>[오늘은] 팥죽 먹고 한살 더 먹는 날 `동지` - 매일경제, 섹션-society, 요약-동지(冬至)는 24절기 중 22번째로 일년 중 밤이 가장 길고 낮이 가장 짧습니다.</ht:news_item_snippet>
//   <ht:news_item_url>https://www.mk.co.kr/news/society/view/2021/12/1193655/</ht:news_item_url>
//   <ht:news_item_source>매일경제</ht:news_item_source>
// </ht:news_item>
// <ht:news_item>
//   <ht:news_item_title>동짓날(冬至) 세시풍속, &amp;#39;동지 팥죽&amp;#39; 쑤어 먹는 이유는</ht:news_item_title>
//   <ht:news_item_snippet>오늘(22일)은 일년 중 낮이 가장 짧고 밤이 가장 긴 날인 동지(冬至).동짓날은 낮이 다시 길어지기 시작해 따뜻한 기운이 싹트는 새해를 알리는 절기이다.</ht:news_item_snippet>
//   <ht:news_item_url>https://www.headlinejeju.co.kr/news/articleView.html?idxno=471806</ht:news_item_url>
//   <ht:news_item_source>Headline jeju</ht:news_item_source>
// </ht:news_item>
