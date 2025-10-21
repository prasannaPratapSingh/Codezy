import { useState, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import axiosClient from "../utils/axiosClient";
import { Zap, Code, Target, BookOpen, Loader2 } from 'lucide-react';
import { NavLink, useNavigate } from "react-router-dom";


function ProblemGenerator() {
    const [isGenerating, setIsGenerating] = useState(false);
    const [generationStatus, setGenerationStatus] = useState('');
    const [currentStep, setCurrentStep] = useState('');
    const [pid, setpid] = useState(null);
    const navigate=useNavigate()

    const { register, handleSubmit, reset, formState: { errors } } = useForm({
        defaultValues: {
            topic: 'array',
            difficulty: 'easy',
        }
    });

    const onSubmit = async (formData) => {
        setIsGenerating(true);
        setGenerationStatus('');
        setCurrentStep('generating');
        console.log(formData);

        try {
            setGenerationStatus('🤖 Generating problem with AI...');

            const aiResponse = await axiosClient.post('/ai/generate-problem', formData);
            setGenerationStatus("✅ Generated");

            let result = aiResponse.data.message;
            result = result.replace(/^```json\s*\n?/, '').replace(/\n?```\s*$/, '').trim();
            console.log(result);
            let json_format = JSON.parse(result);
            console.log("Parsed JSON:", json_format);

            const problemData = {
                ...json_format,
                generatedBy: 'ai'
            };
            const dbresp = await axiosClient.post('/problem/create', problemData);
            setpid(dbresp.data.probId);
            setGenerationStatus('Saved to DB😍');
            console.log(dbresp.data.probId);   
            setTimeout(() => {
                setGenerationStatus('Redirecting to your problem...');
                console.log("About to navigate to:", `/problem/${dbresp.data.probId}`);
                window.location.href=`/problem/${dbresp.data.probId}`;
                setCurrentStep('redirecting');
            }, 1000);

        } catch (error) {
            setCurrentStep('error');
            setGenerationStatus("AI made a mistake. Please try again.😢");
            console.log('Generation failed:', error);
        } finally {
            setIsGenerating(false);
        }
    };
    return (
        <div className="max-w-2xl mx-auto p-6">
            <div className="card bg-base-100 shadow-xl">
                <div className="card-body">
                    <h2 className="card-title text-2xl mb-6 flex items-center gap-2 text-black">
                        <Zap className="text-primary" size={24} />
                        AI Problem Generator
                    </h2>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        {/* Topic/Problem Type Field */}
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text font-medium flex items-center gap-2">
                                    <BookOpen size={16} />
                                    Problem Topic/Type
                                </span>
                            </label>
                            <select
                                className={`select select-bordered w-full ${errors.difficulty ? 'select-error' : ''}`}
                                {...register("topic", { required: "Topic is required" })}
                                disabled={isGenerating}
                            >
                                <option value="array">Array✨</option>
                                <option value="linkedList">Linked List😁</option>
                                <option value="graph">Graph🙄</option>
                                <option value="dp">Dyanmic Programming😭</option>
                            </select>
                            {errors.topic&&(
                                <label className="label">
                                    <span className="label-text-alt text-error">{errors.difficulty.message}</span>
                                </label>
                            )}
                        </div>

                        {/* Difficulty Level Field */}
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text font-medium flex items-center gap-2">
                                    <Target size={16} />
                                    Difficulty Level
                                </span>
                            </label>
                            <select
                                className={`select select-bordered w-full ${errors.difficulty ? 'select-error' : ''}`}
                                {...register("difficulty", { required: "Difficulty is required" })}
                                disabled={isGenerating}
                            >
                                <option value="easy">Easy</option>
                                <option value="medium">Medium</option>
                                <option value="hard">Hard</option>
                            </select>
                            {errors.difficulty && (
                                <label className="label">
                                    <span className="label-text-alt text-error">{errors.difficulty.message}</span>
                                </label>
                            )}
                        </div>
                        {/* Generate Button */}
                        <div className="form-control mt-8">
                            <button
                                type="submit"
                                className={`btn btn-primary btn-lg w-full ${isGenerating ? 'loading' : ''}`}
                                disabled={isGenerating}
                            >
                                {isGenerating ? (
                                    <>
                                        <Loader2 className="animate-spin mr-2" size={10} />
                                        Generating...
                                    </>
                                ) : (
                                    <>
                                        <Zap className="mr-2" size={20} />
                                        Start Generating Problem
                                    </>
                                )}
                            </button>
                        </div>
                    </form>

                    {/* Status Display */}
                    {(isGenerating || generationStatus) && (
                        <div className="mt-6">
                            <div className={`alert ${currentStep === 'error' ? 'alert-error' :
                                currentStep === 'redirecting' ? 'alert-success' :
                                    'alert-info'
                                } shadow-lg`}>
                                <div className="flex items-center gap-2">
                                    {isGenerating && currentStep !== 'error' && (
                                        <Loader2 className="animate-spin" size={16} />
                                    )}
                                    <span>{generationStatus}</span>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default ProblemGenerator;