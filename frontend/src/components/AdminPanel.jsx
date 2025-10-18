import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import axiosClient from '../utils/axiosClient';
import { useNavigate } from 'react-router';

// Zod schema matching the problem schema
const problemSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  difficulty: z.enum(['easy', 'medium', 'hard']),
  tags: z.enum(['array', 'linkedList', 'graph', 'dp']),
  visibleTestCases: z.array(
    z.object({
      input: z.string().min(1, 'Input is required'),
      output: z.string().min(1, 'Output is required'),
      explanation: z.string().min(1, 'Explanation is required')
    })
  ).min(1, 'At least one visible test case required'),
  hiddenTestCases: z.array(
    z.object({
      input: z.string().min(1, 'Input is required'),
      output: z.string().min(1, 'Output is required')
    })
  ).min(1, 'At least one hidden test case required'),
  startCode: z.array(
    z.object({
      language: z.enum(['C++', 'Java', 'JavaScript']),
      initialCode: z.string().min(1, 'Initial code is required')
    })
  ).length(3, 'All three languages required'),
  referenceSolution: z.array(
    z.object({
      language: z.enum(['C++', 'Java', 'JavaScript']),
      completeCode: z.string().min(1, 'Complete code is required')
    })
  ).length(3, 'All three languages required')
});

function AdminPanel() {
  const navigate = useNavigate();
  const {
    register,
    control,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(problemSchema),
    defaultValues: {
      startCode: [
        { language: 'C++', initialCode: '' },
        { language: 'Java', initialCode: '' },
        { language: 'JavaScript', initialCode: '' }
      ],
      referenceSolution: [
        { language: 'C++', completeCode: '' },
        { language: 'Java', completeCode: '' },
        { language: 'JavaScript', completeCode: '' }
      ]
    }
  });

  const {
    fields: visibleFields,
    append: appendVisible,
    remove: removeVisible
  } = useFieldArray({
    control,
    name: 'visibleTestCases'
  });

  const {
    fields: hiddenFields,
    append: appendHidden,
    remove: removeHidden
  } = useFieldArray({
    control,
    name: 'hiddenTestCases'
  });

  const onSubmit = async (data) => {
    try {
      await axiosClient.post('/problem/create', data);
      alert('Problem created successfully!');
      navigate('/');
    } catch (error) {
      alert(`Error: ${error.response?.data?.message || error.message}`);
    }
  };

    return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-black relative overflow-hidden">
      {/* Animated background shapes */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-slate-700/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gray-600/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-slate-600/5 rounded-full blur-3xl animate-pulse delay-500"></div>
        <div className="absolute top-20 right-20 w-40 h-40 bg-blue-500/5 rounded-full blur-2xl animate-pulse delay-700"></div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-4xl relative z-10">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold mb-3 text-gray-100 drop-shadow-lg">Create New Problem</h1>
          <p className="text-gray-400 text-lg">Define a new coding challenge with test cases and solutions</p>
        </div>
        
        <div className="space-y-8">
          {/* Basic Information */}
          <div className="backdrop-blur-xl bg-gray-900/30 border border-gray-600/20 rounded-3xl shadow-2xl p-8">
            <div className="flex items-center mb-6">
              <div className="w-1 h-8 bg-blue-500 rounded-full mr-4"></div>
              <h2 className="text-2xl font-semibold text-gray-100">Basic Information</h2>
            </div>
            
            <div className="grid grid-cols-1 gap-6">
              <div className="form-control">
                <label className="block mb-2">
                  <span className="text-gray-300 font-medium text-sm uppercase tracking-wide">Title</span>
                </label>
                <input
                  {...register('title')}
                  placeholder="Enter problem title..."
                  className={`w-full px-4 py-3 backdrop-blur-md bg-gray-800/40 border border-gray-600/40 text-gray-100 placeholder-gray-400 focus:bg-gray-800/60 focus:border-gray-500/60 transition-all duration-300 rounded-xl ${errors.title && 'border-red-400'}`}
                />
                {errors.title && (
                  <span className="text-red-400 text-sm mt-2 flex items-center">
                    <span className="w-1 h-1 bg-red-400 rounded-full mr-2"></span>
                    {errors.title.message}
                  </span>
                )}
              </div>

              <div className="form-control">
                <label className="block mb-2">
                  <span className="text-gray-300 font-medium text-sm uppercase tracking-wide">Description</span>
                </label>
                <textarea
                  {...register('description')}
                  placeholder="Describe the problem in detail..."
                  rows={5}
                  className={`w-full px-4 py-3 backdrop-blur-md bg-gray-800/40 border border-gray-600/40 text-gray-100 placeholder-gray-400 focus:bg-gray-800/60 focus:border-gray-500/60 transition-all duration-300 rounded-xl resize-none ${errors.description && 'border-red-400'}`}
                />
                {errors.description && (
                  <span className="text-red-400 text-sm mt-2 flex items-center">
                    <span className="w-1 h-1 bg-red-400 rounded-full mr-2"></span>
                    {errors.description.message}
                  </span>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="form-control">
                  <label className="block mb-2">
                    <span className="text-gray-300 font-medium text-sm uppercase tracking-wide">Difficulty</span>
                  </label>
                  <select
                    {...register('difficulty')}
                    className={`w-full px-4 py-3 backdrop-blur-md bg-gray-800/40 border border-gray-600/40 text-gray-100 focus:bg-gray-800/60 focus:border-gray-500/60 transition-all duration-300 rounded-xl ${errors.difficulty && 'border-red-400'}`}
                  >
                    <option value="easy">Easy</option>
                    <option value="medium">Medium</option>
                    <option value="hard">Hard</option>
                  </select>
                  {errors.difficulty && (
                    <span className="text-red-400 text-sm mt-2 flex items-center">
                      <span className="w-1 h-1 bg-red-400 rounded-full mr-2"></span>
                      {errors.difficulty.message}
                    </span>
                  )}
                </div>

                <div className="form-control">
                  <label className="block mb-2">
                    <span className="text-gray-300 font-medium text-sm uppercase tracking-wide">Tag</span>
                  </label>
                  <select
                    {...register('tags')}
                    className={`w-full px-4 py-3 backdrop-blur-md bg-gray-800/40 border border-gray-600/40 text-gray-100 focus:bg-gray-800/60 focus:border-gray-500/60 transition-all duration-300 rounded-xl ${errors.tags && 'border-red-400'}`}
                  >
                    <option value="array">Array</option>
                    <option value="linkedList">Linked List</option>
                    <option value="graph">Graph</option>
                    <option value="dp">Dynamic Programming</option>
                  </select>
                  {errors.tags && (
                    <span className="text-red-400 text-sm mt-2 flex items-center">
                      <span className="w-1 h-1 bg-red-400 rounded-full mr-2"></span>
                      {errors.tags.message}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Test Cases */}
          <div className="backdrop-blur-xl bg-gray-900/30 border border-gray-600/20 rounded-3xl shadow-2xl p-8">
            <div className="flex items-center mb-6">
              <div className="w-1 h-8 bg-green-500 rounded-full mr-4"></div>
              <h2 className="text-2xl font-semibold text-gray-100">Test Cases</h2>
            </div>
            
            {/* Visible Test Cases */}
            <div className="mb-8">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 gap-4">
                <h3 className="text-lg font-medium text-gray-200 flex items-center">
                  <span className="w-2 h-2 bg-blue-400 rounded-full mr-3"></span>
                  Visible Test Cases
                </h3>
                <button
                  type="button"
                  onClick={() => appendVisible({ input: '', output: '', explanation: '' })}
                  className="px-6 py-2 backdrop-blur-md bg-blue-600/40 border border-blue-500/40 text-blue-100 hover:bg-blue-600/60 hover:border-blue-400/60 transition-all duration-300 rounded-xl font-medium self-start sm:self-auto"
                >
                  Add Visible Case
                </button>
              </div>
              
              <div className="space-y-4">
                {visibleFields.map((field, index) => (
                  <div key={field.id} className="backdrop-blur-md bg-gray-800/20 border border-gray-600/30 p-6 rounded-2xl">
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-gray-300 font-medium">Test Case #{index + 1}</span>
                      <button
                        type="button"
                        onClick={() => removeVisible(index)}
                        className="px-4 py-1 backdrop-blur-md bg-red-600/40 border border-red-500/40 text-red-100 hover:bg-red-600/60 hover:border-red-400/60 transition-all duration-300 rounded-lg text-sm"
                      >
                        Remove
                      </button>
                    </div>
                    
                    <div className="grid grid-cols-1 gap-4">
                      <input
                        {...register(`visibleTestCases.${index}.input`)}
                        placeholder="Input (e.g., [1,2,3,4])"
                        className="w-full px-4 py-3 backdrop-blur-md bg-gray-800/40 border border-gray-600/40 text-gray-100 placeholder-gray-400 focus:bg-gray-800/60 focus:border-gray-500/60 transition-all duration-300 rounded-xl"
                      />
                      
                      <input
                        {...register(`visibleTestCases.${index}.output`)}
                        placeholder="Expected output (e.g., [2,4,6,8])"
                        className="w-full px-4 py-3 backdrop-blur-md bg-gray-800/40 border border-gray-600/40 text-gray-100 placeholder-gray-400 focus:bg-gray-800/60 focus:border-gray-500/60 transition-all duration-300 rounded-xl"
                      />
                      
                      <textarea
                        {...register(`visibleTestCases.${index}.explanation`)}
                        placeholder="Explanation of the test case..."
                        rows={3}
                        className="w-full px-4 py-3 backdrop-blur-md bg-gray-800/40 border border-gray-600/40 text-gray-100 placeholder-gray-400 focus:bg-gray-800/60 focus:border-gray-500/60 transition-all duration-300 rounded-xl resize-none"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Hidden Test Cases */}
            <div>
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 gap-4">
                <h3 className="text-lg font-medium text-gray-200 flex items-center">
                  <span className="w-2 h-2 bg-purple-400 rounded-full mr-3"></span>
                  Hidden Test Cases
                </h3>
                <button
                  type="button"
                  onClick={() => appendHidden({ input: '', output: '' })}
                  className="px-6 py-2 backdrop-blur-md bg-blue-600/40 border border-blue-500/40 text-blue-100 hover:bg-blue-600/60 hover:border-blue-400/60 transition-all duration-300 rounded-xl font-medium self-start sm:self-auto"
                >
                  Add Hidden Case
                </button>
              </div>
              
              <div className="space-y-4">
                {hiddenFields.map((field, index) => (
                  <div key={field.id} className="backdrop-blur-md bg-gray-800/20 border border-gray-600/30 p-6 rounded-2xl">
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-gray-300 font-medium">Hidden Test Case #{index + 1}</span>
                      <button
                        type="button"
                        onClick={() => removeHidden(index)}
                        className="px-4 py-1 backdrop-blur-md bg-red-600/40 border border-red-500/40 text-red-100 hover:bg-red-600/60 hover:border-red-400/60 transition-all duration-300 rounded-lg text-sm"
                      >
                        Remove
                      </button>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <input
                        {...register(`hiddenTestCases.${index}.input`)}
                        placeholder="Input (e.g., [5,6,7,8])"
                        className="w-full px-4 py-3 backdrop-blur-md bg-gray-800/40 border border-gray-600/40 text-gray-100 placeholder-gray-400 focus:bg-gray-800/60 focus:border-gray-500/60 transition-all duration-300 rounded-xl"
                      />
                      
                      <input
                        {...register(`hiddenTestCases.${index}.output`)}
                        placeholder="Expected output (e.g., [10,12,14,16])"
                        className="w-full px-4 py-3 backdrop-blur-md bg-gray-800/40 border border-gray-600/40 text-gray-100 placeholder-gray-400 focus:bg-gray-800/60 focus:border-gray-500/60 transition-all duration-300 rounded-xl"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Code Templates */}
          <div className="backdrop-blur-xl bg-gray-900/30 border border-gray-600/20 rounded-3xl shadow-2xl p-8">
            <div className="flex items-center mb-6">
              <div className="w-1 h-8 bg-orange-500 rounded-full mr-4"></div>
              <h2 className="text-2xl font-semibold text-gray-100">Code Templates</h2>
            </div>
            
            <div className="space-y-8">
              {[0, 1, 2].map((index) => (
                <div key={index} className="backdrop-blur-md bg-gray-800/20 border border-gray-600/30 p-6 rounded-2xl">
                  <div className="flex items-center mb-6">
                    <span className="w-3 h-3 bg-yellow-400 rounded-full mr-3"></span>
                    <h3 className="text-xl font-medium text-gray-200">
                      {index === 0 ? 'C++' : index === 1 ? 'Java' : 'JavaScript'}
                    </h3>
                  </div>
                  
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="form-control">
                      <label className="block mb-3">
                        <span className="text-gray-300 font-medium text-sm uppercase tracking-wide">Initial Code</span>
                      </label>
                      <div className="backdrop-blur-md bg-gray-900/40 border border-gray-600/40 rounded-xl overflow-hidden">
                        <textarea
                          {...register(`startCode.${index}.initialCode`)}
                          placeholder={`// Initial ${index === 0 ? 'C++' : index === 1 ? 'Java' : 'JavaScript'} code template...`}
                          className="w-full px-4 py-4 bg-transparent font-mono text-gray-100 placeholder-gray-400 resize-none focus:outline-none"
                          rows={8}
                        />
                      </div>
                    </div>
                    
                    <div className="form-control">
                      <label className="block mb-3">
                        <span className="text-gray-300 font-medium text-sm uppercase tracking-wide">Reference Solution</span>
                      </label>
                      <div className="backdrop-blur-md bg-gray-900/40 border border-gray-600/40 rounded-xl overflow-hidden">
                        <textarea
                          {...register(`referenceSolution.${index}.completeCode`)}
                          placeholder={`// Complete ${index === 0 ? 'C++' : index === 1 ? 'Java' : 'JavaScript'} solution...`}
                          className="w-full px-4 py-4 bg-transparent font-mono text-gray-100 placeholder-gray-400 resize-none focus:outline-none"
                          rows={8}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-center pt-4">
            <button 
              type="button"
              onClick={handleSubmit(onSubmit)}
              className="px-12 py-4 backdrop-blur-md bg-green-600/40 border border-green-500/40 text-green-100 hover:bg-green-600/60 hover:border-green-400/60 transition-all duration-300 shadow-lg font-semibold rounded-2xl text-lg transform hover:scale-105"
            >
              Create Problem
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminPanel;