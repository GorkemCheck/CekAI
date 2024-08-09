import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { preview } from '../assets';
import { getRandomPrompts } from '../utils';
import { FormField, Loader } from '../components';

const CreatePost = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '',
    prompt: '',
    photo: ''
  });

  const [generatingImage, setGeneratingImage] = useState(false);
  const [loading, setLoading] = useState(false);

  const generateImage = async () => {
    if(form.prompt) {
      try {
        setGeneratingImage(true);
        const response = await fetch('https://cekai.onrender.com/api/v1/stability', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ prompt: form.prompt }),
        });
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Error generating image');
        }

        const data = await response.json();
        setForm({ ...form, photo: `data:image/jpeg;base64,${data.photo}` });
      } catch (error) {
        alert(error.message);
      } finally {
        setGeneratingImage(false);
      }
    } else {
      alert('Please enter a prompt');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.prompt && form.photo) {
      setLoading(true);
      try {
        const response = await fetch('https://cekai.onrender.com/api/v1/post',
        { method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({...form})
        });
        await response.json();
        navigate('/');
      }catch(error) {
          alert(error);
      }finally {
        setLoading(false);
      }
    }else {
      alert('Please enter a prompt and generate an image');
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSurpriseMe = () => {
    const randomP = getRandomPrompts(form.prompt);
    setForm({ ...form, prompt: randomP });
  };

  return (
    <section className='max-w-7xl mx-auto'>
      <div>
        <h1 className='font-extrabold text-[222328] text-[32px]'>
          Create an Image
        </h1>
        <p className="mt-2 text-[#666e75] text-[16px] max-w-[500px]">
          Create your own image by combining your imagination with Core's impressive skills and share them with others!
        </p> 
      </div>

      <form className="mt-16 max-w-3xl" onSubmit={handleSubmit}>
        <div className='flex flex-col gap-5'>
          <FormField 
            labelName="Your Name"
            type="text"
            name="name"
            placeholder="Gorkem Cek"
            value={form.name}
            handleChange={handleChange}
          /> 

          <FormField 
            labelName="Prompt"
            type="text"
            name="prompt"
            placeholder="'A Turkish guy winning a match against a Greek boxer'"
            value={form.prompt}
            handleChange={handleChange}
            isSurpriseMe
            handleSurpriseMe={handleSurpriseMe}
          />
          <div className='relative bg-gray-50 border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 w-64 p-3 h-64 flex justify-center items-center'>
            {form.photo ? (
              <img
                src={form.photo}
                alt={form.prompt}
                className='w-full h-full object-contain'
              />
            ) : (
              <img src={preview} alt="preview" className='w-9/12 h-9/12 object-contain opacity-40' />
            )}

            {generatingImage && (
              <div className='absolute inset-0 z-0 flex justify-center items-center bg-[rgba(0,0,0,0.5)] rounded-lg'>
                <Loader />
              </div>
            )}  
          </div>
        </div>

        <div className='mt-5 flex gap-5'>
          <button
            type="button"
            onClick={generateImage}
            className='text-white bg-green-700 font-medium rounded-md text-sm w-full sm:w-auto px-5 py-2.5 text-center'
          >
            {generatingImage ? "Generating Image..." : "Generate an Image"}
          </button>
        </div>

        <div className='mt-10'>
          <p className='mt-2 text-[#666e75] text-[14px]'>You can share your image with the others!</p>
          <button
            type='submit'
            className='mt-3 text-white bg-blue-700 font-medium rounded-md w-full sm:w-auto px-5 py-2 text-center'
          >
            {loading ? "Sharing the Image..." : "Share the Image"}
          </button>
        </div>
      </form>
    </section>
  );
};

export default CreatePost;
