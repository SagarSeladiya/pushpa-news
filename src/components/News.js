import React, { useState, useEffect, useCallback } from "react";
import NewsItem from "./NewsItem";
import Spinner from "./Spinner";
import PropTypes from "prop-types";
import InfiniteScroll from "react-infinite-scroll-component";

const News = (props) => {
  const { country, pageSize, category, apiKey, setProgress } = props;

  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalResults, setTotalResults] = useState(0);

  const capitalizeFLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  const updateNews = useCallback(async () => {
    setProgress(0);
    const url = `https://newsapi.org/v2/top-headlines?country=${country}&category=${category}&apiKey=${apiKey}&page=${page}&pageSize=${pageSize}`;

    setLoading(true);
    try {
      let data = await fetch(url);
      setProgress(30);
      let parsedData = await data.json();
      setProgress(70);
      setArticles(parsedData.articles);

      setTotalResults(parsedData.totalResults);
      setLoading(false);
      setProgress(100);
    } catch (error) {
      console.error("Error updating news:", error);
    }
  }, [setProgress, country, category, apiKey, page, pageSize]);

  useEffect(() => {
    updateNews();
  }, [updateNews]);

  const handlePrevClick = () => {
    setPage((prevPage) => prevPage - 1);
    updateNews();
  };

  const handleNextClick = () => {
    setPage((prevPage) => prevPage + 1);
    updateNews();
  };

  const fetchMoreData = async () => {
    const nextPage = page + 1;
    const url = `https://newsapi.org/v2/top-headlines?country=${country}&category=${category}&apiKey=${apiKey}&page=${nextPage}&pageSize=${pageSize}`;

    try {
      let data = await fetch(url);
      let parsedData = await data.json();
      setArticles((prevArticles) => prevArticles.concat(parsedData.articles));
      setTotalResults(parsedData.totalResults);
      setPage(nextPage);
    } catch (error) {
      console.error("Error fetching more data:", error);
    }
  };

  return (
    <>
      <h1 className="my-4 mb-4 text-center fw-normal">
        Pushpa News - Top {capitalizeFLetter(category)} Headlines
      </h1>
      {loading && <Spinner />}
      <InfiniteScroll
        dataLength={articles?.length}
        next={fetchMoreData}
        hasMore={articles?.length !== totalResults}
        loader={<Spinner />}
      >
        <div className="container">
          <div className="row">
            {articles?.map((element) => (
              <div className="col-sm-4" key={element.url}>
                <NewsItem
                  title={element.title ? element.title : ""}
                  description={element.description ? element.description : ""}
                  urlToImage={element.urlToImage}
                  url={element.url}
                  author={element.author}
                  publishedAt={element.publishedAt}
                  source={element.source.name}
                />
              </div>
            ))}
          </div>
        </div>
      </InfiniteScroll>
      {/* Additional code for Previous and Next buttons */}
    </>
  );
};

News.defaultProps = {
  country: "in",
  pageSize: 8,
  category: "general",
};

News.propTypes = {
  country: PropTypes.string,
  pageSize: PropTypes.number,
  category: PropTypes.string,
  apiKey: PropTypes.string, // Make sure to add apiKey in propTypes
  setProgress: PropTypes.func.isRequired, // Assuming setProgress is a function
};

export default News;
