import React, {useState, useEffect} from 'react';

import {Card, FormField, Loader} from '../components';

const RenderCard = ({ data, title }) => {
  if (data?.length > 0) {
    return data.map((post) => <Card key={post.id} {...post} />);
  }

  return (
    <h2 className='mt-5 font-bold text-[#6449ff] text-xl uppercase'>
      {title}
    </h2>
  );
};

const Home = () => {
  const [loading, setloading] = useState(false);
  const [allPosts, setallPosts] = useState(null);
  const [search, setsearch] = useState('');
  const [searchedResults, setSearchedResults] = useState(null);
  const [searchTimeout, setSearchTimeout] = useState(null)

  useEffect(() => {
    const fetchPosts = async () => {
      setloading(true);

      try {
        const response = await fetch('https://cekai.onrender.com/api/v1/post', {
          method: 'GET',
          headers: {'Content-Type': 'application/json'},
        })

        if(response.ok) {
          const result = await response.json();

          setallPosts(result.data.reverse());
        }
      }catch(err) {
        alert(err);
      } finally {
        setloading(false);
      }
    }
    fetchPosts();
  }, []);

  const handleSearchChange = async (e) => {
    clearTimeout(searchTimeout);
    setsearch(e.target.value);

    setSearchTimeout(
      setTimeout(() => {
        const searchResults = allPosts.filter((item) => item.name.toLowerCase().includes(
        search.toLowerCase()) || item.prompt.toLowerCase().includes(
        search.toLowerCase()));

        setSearchedResults(searchResults);
      }, 500)
    )
    
  }

  return (
    <section className='max-w-7xl mx-auto'>
      <div>
        <h1 className='font-extrabold text-[222328] text-[32px]'>
          The Arts of The Community
        </h1>
        <p className="mt-2 text-[#666e75] text-[16px] max-w-[500px]">
          Look through what the others have created by combining their
           imagination with Core's impressive skills!</p> 
      </div>

      <div className='mt-16'>
        <FormField 
        labelName="Search posts"
        type="text"
        name="text"
        placeholder="Search posts"
        value={search}
        handleChange={handleSearchChange}/>
      </div>

      <div className='mt-10'>
        {loading ? (
          <div className='flex justify-center items-center'>
              <Loader />
          </div>
        ): (
          <>
              {search && (
                <h2 className='font-medium text-[#666e75]
                text-xl mb-3'>
                  Showing results for <span className='text-[#222328]'>
                    {search}
                  </span>
                </h2>
              )}
              <div className='grid lg:grid-cols-4 sm:grid-cols-3
              xs:grid-cols-2 grid-cols-1 gap-3'>
                {search ? (
                  <RenderCard 
                  data = {searchedResults}
                  title= "No results found."/>
                ) : (
                  <RenderCard 
                  data = {allPosts}
                  title = "No posts found."
                  />
                )}
              </div>
          </>
        )}
      </div>
    </section>
  )
}

export default Home