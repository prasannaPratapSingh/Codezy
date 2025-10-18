import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import axiosClient from '../utils/axiosClient';
import { useNavigate, useParams } from 'react-router';
import { useEffect } from 'react';
import { useState } from 'react';

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

function UpdateProblem() {
    const [problem, setProblem] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();
    const { problemId } = useParams();

    const {
        register,
        control,
        handleSubmit,
        reset,
        formState: { errors }
    } = useForm({
        resolver: zodResolver(problemSchema),
        defaultValues: {
            title: '',
            description: '',
            difficulty: 'easy',
            tags: 'array',
            visibleTestCases: [{ input: '', output: '', explanation: '' }],
            hiddenTestCases: [{ input: '', output: '' }],
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

    useEffect(() => {
        const problemDetails = async () => {
            try {
                setIsLoading(true);
                const details = await axiosClient.get(`/problem/problemById/${problemId}`);
                const problemData = details.data;
                setProblem(problemData);
                console.log(problemData);

                // Transform the data to match form structure
                const formData = {
                    title: problemData.title || '',
                    description: problemData.description || '',
                    difficulty: problemData.difficulty || 'easy',
                    tags: problemData.tags || 'array',
                    visibleTestCases: problemData.visibleTestCases && problemData.visibleTestCases.length > 0 
                        ? problemData.visibleTestCases 
                        : [{ input: '', output: '', explanation: '' }],
                    hiddenTestCases: problemData.hiddenTestCases && problemData.hiddenTestCases.length > 0 
                        ? problemData.hiddenTestCases 
                        : [{ input: '', output: '' }],
                    startCode: transformCodeArray(problemData.startCode, 'initialCode'),
                    referenceSolution: transformCodeArray(problemData.referenceSolution, 'completeCode')
                };

                reset(formData);
                setIsLoading(false);
            }
            catch (err) {
                console.log('Error fetching problem by Id', err);
                setIsLoading(false);
            }
        };
        
        if (problemId) {
            problemDetails();
        }
    }, [problemId, reset]);

    // Helper function to transform code arrays and ensure proper order
    const transformCodeArray = (codeArray, codeField) => {
        if (!codeArray || !Array.isArray(codeArray)) {
            return [
                { language: 'C++', [codeField]: '' },
                { language: 'Java', [codeField]: '' },
                { language: 'JavaScript', [codeField]: '' }
            ];
        }

        // Create a map for easy lookup
        const codeMap = {};
        codeArray.forEach(item => {
            // Normalize language names to match schema
            let normalizedLang = item.language;
            if (item.language === 'c++') normalizedLang = 'C++';
            if (item.language === 'javascript') normalizedLang = 'JavaScript';
            if (item.language === 'java') normalizedLang = 'Java';
            
            codeMap[normalizedLang] = item[codeField] || '';
        });

        // Return in the expected order
        return [
            { language: 'C++', [codeField]: codeMap['C++'] || '' },
            { language: 'Java', [codeField]: codeMap['Java'] || '' },
            { language: 'JavaScript', [codeField]: codeMap['JavaScript'] || '' }
        ];
    };

    const onSubmit = async (data) => {
        try {
            // Use PUT/PATCH for update instead of POST
            await axiosClient.put(`/problem/update/${problemId}`, data);
            alert('Problem updated successfully!');
            navigate('/admin/update');
        } catch (error) {
            alert(`Error: ${error.response?.data?.message || error.message}`);
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800 flex justify-center items-center">
                <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-8 shadow-2xl">
                    <div className="flex flex-col items-center space-y-4">
                        <div className="w-16 h-16 border-4 border-slate-600 border-t-white rounded-full animate-spin"></div>
                        <span className="text-white font-semibold text-lg">Loading problem...</span>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800">
            <div className="container mx-auto p-8 max-w-6xl">
                <h1 className="text-5xl font-bold mb-8 text-white">Update Problem</h1>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Left Column */}
                    <div className="space-y-8">
                        {/* Basic Information */}
                        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl shadow-2xl p-8 hover:bg-slate-800/70 transition-all duration-300">
                            <h2 className="text-2xl font-bold mb-6 text-white flex items-center">
                                <div className="w-3 h-8 bg-gradient-to-b from-cyan-400 to-blue-500 rounded-full mr-4"></div>
                                Basic Information
                            </h2>
                            <div className="space-y-6">
                                <div className="form-control">
                                    <label className="label">
                                        <span className="label-text text-white font-semibold text-base">Title</span>
                                    </label>
                                    <input
                                        {...register('title')}
                                        className={`input w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 text-white placeholder-gray-300 focus:bg-slate-700/70 focus:border-cyan-400/70 focus:ring-4 focus:ring-cyan-400/20 transition-all duration-300 rounded-xl ${errors.title ? 'border-red-400' : ''}`}
                                    />
                                    {errors.title && (
                                        <span className="text-red-300 text-sm mt-2 block">{errors.title.message}</span>
                                    )}
                                </div>

                                <div className="form-control">
                                    <label className="label">
                                        <span className="label-text text-white font-semibold text-base">Description</span>
                                    </label>
                                    <textarea
                                        {...register('description')}
                                        className={`textarea w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 text-white placeholder-gray-300 focus:bg-slate-700/70 focus:border-cyan-400/70 focus:ring-4 focus:ring-cyan-400/20 transition-all duration-300 h-32 rounded-xl resize-none ${errors.description ? 'border-red-400' : ''}`}
                                    />
                                    {errors.description && (
                                        <span className="text-red-300 text-sm mt-2 block">{errors.description.message}</span>
                                    )}
                                </div>

                                <div className="flex gap-6">
                                    <div className="form-control w-1/2">
                                        <label className="label">
                                            <span className="label-text text-white font-semibold text-base">Difficulty</span>
                                        </label>
                                        <select
                                            {...register('difficulty')}
                                            className={`select w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 text-white focus:bg-slate-700/70 focus:border-cyan-400/70 focus:ring-4 focus:ring-cyan-400/20 transition-all duration-300 rounded-xl ${errors.difficulty ? 'border-red-400' : ''}`}
                                        >
                                            <option value="easy">Easy</option>
                                            <option value="medium">Medium</option>
                                            <option value="hard">Hard</option>
                                        </select>
                                        {errors.difficulty && (
                                            <span className="text-red-300 text-sm mt-2 block">{errors.difficulty.message}</span>
                                        )}
                                    </div>

                                    <div className="form-control w-1/2">
                                        <label className="label">
                                            <span className="label-text text-white font-semibold text-base">Tag</span>
                                        </label>
                                        <select
                                            {...register('tags')}
                                            className={`select w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 text-white focus:bg-slate-700/70 focus:border-cyan-400/70 focus:ring-4 focus:ring-cyan-400/20 transition-all duration-300 rounded-xl ${errors.tags ? 'border-red-400' : ''}`}
                                        >
                                            <option value="array">Array</option>
                                            <option value="linkedList">Linked List</option>
                                            <option value="graph">Graph</option>
                                            <option value="dp">DP</option>
                                        </select>
                                        {errors.tags && (
                                            <span className="text-red-300 text-sm mt-2 block">{errors.tags.message}</span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Test Cases */}
                        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl shadow-2xl p-8 hover:bg-slate-800/70 transition-all duration-300">
                            <h2 className="text-2xl font-bold mb-6 text-white flex items-center">
                                <div className="w-3 h-8 bg-gradient-to-b from-green-400 to-emerald-500 rounded-full mr-4"></div>
                                Test Cases
                            </h2>

                            {/* Visible Test Cases */}
                            <div className="space-y-6 mb-8">
                                <div className="flex justify-between items-center">
                                    <h3 className="font-bold text-white text-lg">Visible Test Cases</h3>
                                    <button
                                        type="button"
                                        onClick={() => appendVisible({ input: '', output: '', explanation: '' })}
                                        className="btn px-6 py-2 bg-blue-600 hover:bg-blue-500 border border-blue-500/50 text-white transition-all duration-300 btn-sm rounded-xl font-semibold"
                                    >
                                        Add Visible Case
                                    </button>
                                </div>

                                {visibleFields.map((field, index) => (
                                    <div key={field.id} className="bg-slate-700/30 border border-slate-600/30 p-6 rounded-2xl space-y-4">
                                        <div className="flex justify-end">
                                            <button
                                                type="button"
                                                onClick={() => removeVisible(index)}
                                                className="btn px-4 py-1 bg-red-600 hover:bg-red-500 border border-red-500/50 text-white transition-all duration-300 btn-xs rounded-lg"
                                                disabled={visibleFields.length === 1}
                                            >
                                                Remove
                                            </button>
                                        </div>

                                        <input
                                            {...register(`visibleTestCases.${index}.input`)}
                                            placeholder="Input"
                                            className={`input w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 text-white placeholder-gray-300 focus:bg-slate-700/70 focus:border-cyan-400/70 transition-all duration-300 rounded-xl ${errors.visibleTestCases?.[index]?.input ? 'border-red-400' : ''}`}
                                        />
                                        {errors.visibleTestCases?.[index]?.input && (
                                            <span className="text-red-300 text-sm">{errors.visibleTestCases[index].input.message}</span>
                                        )}

                                        <input
                                            {...register(`visibleTestCases.${index}.output`)}
                                            placeholder="Output"
                                            className={`input w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 text-white placeholder-gray-300 focus:bg-slate-700/70 focus:border-cyan-400/70 transition-all duration-300 rounded-xl ${errors.visibleTestCases?.[index]?.output ? 'border-red-400' : ''}`}
                                        />
                                        {errors.visibleTestCases?.[index]?.output && (
                                            <span className="text-red-300 text-sm">{errors.visibleTestCases[index].output.message}</span>
                                        )}

                                        <textarea
                                            {...register(`visibleTestCases.${index}.explanation`)}
                                            placeholder="Explanation"
                                            className={`textarea w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 text-white placeholder-gray-300 focus:bg-slate-700/70 focus:border-cyan-400/70 transition-all duration-300 rounded-xl resize-none ${errors.visibleTestCases?.[index]?.explanation ? 'border-red-400' : ''}`}
                                        />
                                        {errors.visibleTestCases?.[index]?.explanation && (
                                            <span className="text-red-300 text-sm">{errors.visibleTestCases[index].explanation.message}</span>
                                        )}
                                    </div>
                                ))}
                            </div>

                            {/* Hidden Test Cases */}
                            <div className="space-y-6">
                                <div className="flex justify-between items-center">
                                    <h3 className="font-bold text-white text-lg">Hidden Test Cases</h3>
                                    <button
                                        type="button"
                                        onClick={() => appendHidden({ input: '', output: '' })}
                                        className="btn px-6 py-2 bg-purple-600 hover:bg-purple-500 border border-purple-500/50 text-white transition-all duration-300 btn-sm rounded-xl font-semibold"
                                    >
                                        Add Hidden Case
                                    </button>
                                </div>

                                {hiddenFields.map((field, index) => (
                                    <div key={field.id} className="bg-slate-700/30 border border-slate-600/30 p-6 rounded-2xl space-y-4">
                                        <div className="flex justify-end">
                                            <button
                                                type="button"
                                                onClick={() => removeHidden(index)}
                                                className="btn px-4 py-1 bg-red-600 hover:bg-red-500 border border-red-500/50 text-white transition-all duration-300 btn-xs rounded-lg"
                                                disabled={hiddenFields.length === 1}
                                            >
                                                Remove
                                            </button>
                                        </div>

                                        <input
                                            {...register(`hiddenTestCases.${index}.input`)}
                                            placeholder="Input"
                                            className={`input w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 text-white placeholder-gray-300 focus:bg-slate-700/70 focus:border-cyan-400/70 transition-all duration-300 rounded-xl ${errors.hiddenTestCases?.[index]?.input ? 'border-red-400' : ''}`}
                                        />
                                        {errors.hiddenTestCases?.[index]?.input && (
                                            <span className="text-red-300 text-sm">{errors.hiddenTestCases[index].input.message}</span>
                                        )}

                                        <input
                                            {...register(`hiddenTestCases.${index}.output`)}
                                            placeholder="Output"
                                            className={`input w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 text-white placeholder-gray-300 focus:bg-slate-700/70 focus:border-cyan-400/70 transition-all duration-300 rounded-xl ${errors.hiddenTestCases?.[index]?.output ? 'border-red-400' : ''}`}
                                        />
                                        {errors.hiddenTestCases?.[index]?.output && (
                                            <span className="text-red-300 text-sm">{errors.hiddenTestCases[index].output.message}</span>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Code Templates */}
                    <div className="space-y-8">
                        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl shadow-2xl p-8 hover:bg-slate-800/70 transition-all duration-300">
                            <h2 className="text-2xl font-bold mb-6 text-white flex items-center">
                                <div className="w-3 h-8 bg-gradient-to-b from-orange-400 to-red-500 rounded-full mr-4"></div>
                                Code Templates
                            </h2>

                            <div className="space-y-8">
                                {[
                                    { index: 0, name: 'C++', icon: '⚡', color: 'from-blue-400 to-cyan-400' },
                                    { index: 1, name: 'Java', icon: '☕', color: 'from-orange-400 to-red-400' },
                                    { index: 2, name: 'JavaScript', icon: '🟨', color: 'from-yellow-400 to-orange-400' }
                                ].map(({ index, name, icon, color }) => (
                                    <div key={index} className="space-y-4">
                                        <div className={`text-lg font-bold bg-gradient-to-r ${color} bg-clip-text text-transparent flex items-center gap-2`}>
                                            <span className="text-2xl">{icon}</span>
                                            {name}
                                        </div>

                                        <div className="form-control">
                                            <label className="label">
                                                <span className="label-text text-white font-semibold">Initial Code</span>
                                            </label>
                                            <div className="bg-gray-900/50 border border-slate-600/50 rounded-xl p-4 font-mono">
                                                <textarea
                                                    {...register(`startCode.${index}.initialCode`)}
                                                    className={`w-full bg-transparent text-gray-100 placeholder-gray-500 resize-none focus:outline-none ${errors.startCode?.[index]?.initialCode ? 'border-red-400' : ''}`}
                                                    rows={6}
                                                />
                                            </div>
                                            {errors.startCode?.[index]?.initialCode && (
                                                <span className="text-red-300 text-sm mt-2">{errors.startCode[index].initialCode.message}</span>
                                            )}
                                        </div>

                                        <div className="form-control">
                                            <label className="label">
                                                <span className="label-text text-white font-semibold">Reference Solution</span>
                                            </label>
                                            <div className="bg-gray-900/50 border border-slate-600/50 rounded-xl p-4 font-mono">
                                                <textarea
                                                    {...register(`referenceSolution.${index}.completeCode`)}
                                                    className={`w-full bg-transparent text-gray-100 placeholder-gray-500 resize-none focus:outline-none ${errors.referenceSolution?.[index]?.completeCode ? 'border-red-400' : ''}`}
                                                    rows={6}
                                                />
                                            </div>
                                            {errors.referenceSolution?.[index]?.completeCode && (
                                                <span className="text-red-300 text-sm mt-2">{errors.referenceSolution[index].completeCode.message}</span>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="lg:col-span-2 mt-8">
                        <button type="submit" onClick={handleSubmit(onSubmit)} className="btn w-full py-4 bg-emerald-600 hover:bg-emerald-500 border border-emerald-500/50 text-white transition-all duration-500 shadow-2xl font-bold text-lg rounded-2xl transform hover:scale-105">
                            Update Problem
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default UpdateProblem;