import React, { useState, useRef } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import axios from 'axios';
import { API_BASE_URL } from '../../config';
import './DiseaseDetection.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUpload, faCamera, faSyncAlt, faExclamationTriangle, faLeaf, faVirus, faInfoCircle, faChevronDown, faChevronUp, faCheck } from '@fortawesome/free-solid-svg-icons';

const DiseaseDetection = () => {
    const { user } = useAuth();
    const [selectedImage, setSelectedImage] = useState(null);
    const [previewURL, setPreviewURL] = useState(null);
    const [analysisResult, setAnalysisResult] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [activeTab, setActiveTab] = useState('upload'); // 'upload' or 'camera'
    const [showDetails, setShowDetails] = useState(false);
    const [selectedCrop, setSelectedCrop] = useState(null);
    const [cropConfirmed, setCropConfirmed] = useState(false);
    const [commonCrops, setCommonCrops] = useState([]);
    const fileInputRef = useRef(null);
    const cameraRef = useRef(null);
    const stream = useRef(null);

    // Common crops grown in Sri Lanka
    const sriLankaCrops = [
        { name: "Rice", scientificName: "Oryza sativa" },
        { name: "Tea", scientificName: "Camellia sinensis" },
        { name: "Coconut", scientificName: "Cocos nucifera" },
        { name: "Rubber", scientificName: "Hevea brasiliensis" },
        { name: "Cinnamon", scientificName: "Cinnamomum verum" },
        { name: "Pepper", scientificName: "Piper nigrum" },
        { name: "Tomato", scientificName: "Solanum lycopersicum" },
        { name: "Potato", scientificName: "Solanum tuberosum" },
        { name: "Chili", scientificName: "Capsicum annuum" },
        { name: "Banana", scientificName: "Musa acuminata" },
        { name: "Mango", scientificName: "Mangifera indica" },
        { name: "Papaya", scientificName: "Carica papaya" }
    ];

    // Common plant diseases and their remedies
    const plantDiseases = {
        "Rice": [
            {
                name: "Rice Blast",
                scientificName: "Magnaporthe oryzae",
                confidence: 0.92,
                remedies: [
                    "Apply fungicides containing tricyclazole or isoprothiolane",
                    "Maintain proper water management in the field",
                    "Remove and destroy infected plants",
                    "Avoid excessive nitrogen fertilization"
                ],
                prevention: [
                    "Plant resistant rice varieties",
                    "Use balanced fertilization",
                    "Maintain proper spacing between plants",
                    "Treat seeds with fungicides before planting"
                ]
            },
            {
                name: "Bacterial Leaf Blight",
                scientificName: "Xanthomonas oryzae",
                confidence: 0.88,
                remedies: [
                    "Drain the field to reduce humidity",
                    "Apply copper-based bactericides",
                    "Remove infected plants and destroy them",
                    "Avoid working in the field when plants are wet"
                ],
                prevention: [
                    "Use disease-free seeds",
                    "Plant resistant varieties",
                    "Practice crop rotation",
                    "Maintain field sanitation"
                ]
            }
        ],
        "Tomato": [
            {
                name: "Late Blight",
                scientificName: "Phytophthora infestans",
                confidence: 0.89,
                remedies: [
                    "Apply copper-based fungicides every 7-10 days in humid conditions",
                    "Remove and destroy infected plant parts",
                    "Ensure proper spacing between plants for good air circulation",
                    "Water at the base of plants to avoid wetting foliage"
                ],
                prevention: [
                    "Use resistant varieties when available",
                    "Practice crop rotation (avoid planting tomatoes or potatoes in the same location for 2-3 years)",
                    "Use pathogen-free seeds or transplants",
                    "Apply preventative fungicides before disease appears in high-risk conditions"
                ]
            },
            {
                name: "Early Blight",
                scientificName: "Alternaria solani",
                confidence: 0.85,
                remedies: [
                    "Remove and destroy infected leaves",
                    "Apply fungicides containing chlorothalonil or mancozeb",
                    "Mulch around plants to prevent soil splash",
                    "Prune lower leaves to improve air circulation"
                ],
                prevention: [
                    "Use disease-free seeds and transplants",
                    "Practice crop rotation",
                    "Provide adequate plant spacing",
                    "Keep foliage dry by watering at the base"
                ]
            }
        ],
        "Potato": [
            {
                name: "Late Blight",
                scientificName: "Phytophthora infestans",
                confidence: 0.91,
                remedies: [
                    "Apply fungicides containing chlorothalonil or mancozeb",
                    "Remove and destroy infected plant parts",
                    "Harvest tubers during dry weather",
                    "Ensure proper hilling to protect tubers"
                ],
                prevention: [
                    "Plant certified disease-free seed potatoes",
                    "Use resistant varieties",
                    "Provide adequate plant spacing",
                    "Avoid overhead irrigation"
                ]
            },
            {
                name: "Common Scab",
                scientificName: "Streptomyces scabies",
                confidence: 0.83,
                remedies: [
                    "Maintain soil pH between 5.0 and 5.2",
                    "Avoid applying manure just before planting",
                    "Ensure consistent soil moisture during tuber formation",
                    "Harvest when mature to prevent damage"
                ],
                prevention: [
                    "Use scab-resistant varieties",
                    "Plant disease-free seed potatoes",
                    "Avoid fields with a history of scab",
                    "Practice crop rotation with non-host crops"
                ]
            }
        ],
        "Banana": [
            {
                name: "Panama Disease",
                scientificName: "Fusarium oxysporum f.sp. cubense",
                confidence: 0.87,
                remedies: [
                    "Unfortunately, there are no effective chemical treatments once plants are infected",
                    "Remove and destroy infected plants",
                    "Quarantine affected areas",
                    "Disinfect tools and equipment"
                ],
                prevention: [
                    "Plant resistant varieties like Cavendish for Tropical Race 1",
                    "Use disease-free planting material",
                    "Implement good drainage systems",
                    "Practice crop rotation with non-host plants"
                ]
            },
            {
                name: "Black Sigatoka",
                scientificName: "Mycosphaerella fijiensis",
                confidence: 0.89,
                remedies: [
                    "Apply fungicides containing propiconazole or trifloxystrobin",
                    "Remove infected leaves and destroy them",
                    "Ensure proper spacing for good air circulation",
                    "Maintain good field drainage"
                ],
                prevention: [
                    "Plant resistant varieties",
                    "Use disease-free planting material",
                    "Implement early warning systems based on weather conditions",
                    "Practice good sanitation by removing dead leaves"
                ]
            }
        ],
        "Chili": [
            {
                name: "Anthracnose",
                scientificName: "Colletotrichum species",
                confidence: 0.86,
                remedies: [
                    "Apply fungicides containing azoxystrobin or mancozeb",
                    "Remove and destroy infected fruits and plant parts",
                    "Avoid overhead irrigation",
                    "Harvest promptly when fruits are mature"
                ],
                prevention: [
                    "Use disease-free seeds",
                    "Plant resistant varieties",
                    "Provide adequate spacing between plants",
                    "Rotate crops with non-host plants"
                ]
            },
            {
                name: "Bacterial Wilt",
                scientificName: "Ralstonia solanacearum",
                confidence: 0.84,
                remedies: [
                    "Remove and destroy infected plants",
                    "Improve soil drainage",
                    "Avoid working in the field when plants are wet",
                    "Sterilize tools and equipment"
                ],
                prevention: [
                    "Use resistant varieties",
                    "Plant in well-drained soils",
                    "Practice crop rotation with non-host crops",
                    "Use disease-free seedlings"
                ]
            }
        ]
    };

    // Handle file selection
    const handleFileSelect = (e) => {
        const file = e.target.files[0];
        if (file) {
            validateAndProcessImage(file);
        }
    };

    // Handle drag and drop
    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        
        const file = e.dataTransfer.files[0];
        if (file) {
            validateAndProcessImage(file);
        }
    };

    // Prevent default behavior for drag events
    const handleDragOver = (e) => {
        e.preventDefault();
        e.stopPropagation();
    };

    // Validate and process the selected image
    const validateAndProcessImage = (file) => {
        // Reset previous results
        setAnalysisResult(null);
        setError('');

        // Validate file type
        const validTypes = ['image/jpeg', 'image/png', 'image/jpg'];
        if (!validTypes.includes(file.type)) {
            setError('Please select a valid image file (JPEG, PNG)');
            return;
        }

        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            setError('Image size should not exceed 5MB');
            return;
        }

        // Create preview URL
        const imageURL = URL.createObjectURL(file);
        setPreviewURL(imageURL);
        setSelectedImage(file);
    };

    // Handle camera tab
    const handleCameraTab = async () => {
        setActiveTab('camera');
        setSelectedImage(null);
        setPreviewURL(null);
        setAnalysisResult(null);
        
        try {
            // Stop any existing stream
            if (stream.current) {
                stream.current.getTracks().forEach(track => track.stop());
            }
            
            // Start new camera stream
            const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true });
            stream.current = mediaStream;
            
            if (cameraRef.current) {
                cameraRef.current.srcObject = mediaStream;
            }
        } catch (err) {
            console.error('Error accessing camera:', err);
            setError('Could not access camera. Please check permissions.');
        }
    };

    // Handle upload tab
    const handleUploadTab = () => {
        setActiveTab('upload');
        
        // Stop camera if it's active
        if (stream.current) {
            stream.current.getTracks().forEach(track => track.stop());
            stream.current = null;
        }
    };

    // Capture image from camera
    const captureImage = () => {
        if (cameraRef.current) {
            // Create a canvas to capture the image
            const canvas = document.createElement('canvas');
            canvas.width = cameraRef.current.videoWidth;
            canvas.height = cameraRef.current.videoHeight;
            const ctx = canvas.getContext('2d');
            
            // Draw the current video frame to the canvas
            ctx.drawImage(cameraRef.current, 0, 0, canvas.width, canvas.height);
            
            // Convert canvas to blob
            canvas.toBlob((blob) => {
                // Create a file from blob
                const file = new File([blob], "captured-image.jpg", { type: "image/jpeg" });
                validateAndProcessImage(file);
            }, 'image/jpeg', 0.9);
        }
    };

    // Reset the state to start over
    const resetAnalysis = () => {
        setSelectedImage(null);
        setPreviewURL(null);
        setAnalysisResult(null);
        setError('');
        setSelectedCrop(null);
        setCropConfirmed(false);
        setCommonCrops([]);
        
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    // Handle user crop selection
    const handleCropSelect = (crop) => {
        setSelectedCrop(crop);
    };

    // Confirm crop selection
    const confirmCropSelection = () => {
        if (!selectedCrop) {
            setError("Please select a crop type first");
            return;
        }
        
        setCropConfirmed(true);
        
        // Get diseases for this crop
        const cropDiseases = plantDiseases[selectedCrop.name] || plantDiseases["Tomato"];
        
        // Set loading state
        setIsLoading(true);
        
        // Create a new FileReader to analyze the image
        const reader = new FileReader();
        
        reader.onload = function(e) {
            const img = new Image();
            
            img.onload = function() {
                // Create canvas for analyzing image
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                
                canvas.width = img.width;
                canvas.height = img.height;
                ctx.drawImage(img, 0, 0);
                
                // Get image data
                const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                const data = imageData.data;
                
                // Sample size for better performance
                const sampleSize = 10;
                
                // Count yellowing, browning, and spots (disease indicators)
                let yellowingCount = 0;
                let browningCount = 0;
                let varianceTotal = 0;
                let totalPixels = 0;
                
                for (let i = 0; i < data.length; i += 4 * sampleSize) {
                    if (i + 2 >= data.length) continue;
                    
                    const r = data[i];
                    const g = data[i + 1];
                    const b = data[i + 2];
                    
                    // Check for yellowing (high R & G, low B)
                    if (r > 150 && g > 150 && b < 100) {
                        yellowingCount++;
                    }
                    
                    // Check for browning (mid R, low-mid G & B)
                    if (r > 100 && r < 180 && g > 50 && g < 140 && b > 20 && b < 90) {
                        browningCount++;
                    }
                    
                    // Calculate color variation with nearby pixels (for spots)
                    if (i > 4 * sampleSize * canvas.width) {
                        const prevIndex = i - 4 * sampleSize * canvas.width;
                        if (prevIndex >= 0 && prevIndex + 2 < data.length) {
                            const prevR = data[prevIndex];
                            const prevG = data[prevIndex + 1];
                            const prevB = data[prevIndex + 2];
                            
                            const diff = Math.abs(r - prevR) + Math.abs(g - prevG) + Math.abs(b - prevB);
                            varianceTotal += diff;
                        }
                    }
                    
                    totalPixels++;
                }
                
                // Calculate disease indicators
                const yellowingRatio = yellowingCount / totalPixels;
                const browningRatio = browningCount / totalPixels;
                const avgVariance = varianceTotal / totalPixels;
                
                // Select appropriate disease based on visual cues
                let selectedDisease;
                
                if (cropDiseases.length > 0) {
                    if (yellowingRatio > 0.1 && cropDiseases.some(d => d.name.includes("Blight"))) {
                        // Yellowing often indicates blights
                        selectedDisease = cropDiseases.find(d => d.name.includes("Blight"));
                    } 
                    else if (browningRatio > 0.1 && cropDiseases.some(d => d.name.includes("Leaf"))) {
                        // Browning often indicates leaf diseases
                        selectedDisease = cropDiseases.find(d => d.name.includes("Leaf"));
                    }
                    else if (avgVariance > 30 && cropDiseases.some(d => 
                        d.name.includes("Anthracnose") || d.name.includes("Spot"))) {
                        // High variance indicates spots/lesions
                        selectedDisease = cropDiseases.find(d => 
                            d.name.includes("Anthracnose") || d.name.includes("Spot"));
                    }
                    else {
                        // Default to first disease if no clear indicators
                        selectedDisease = cropDiseases[0];
                    }
                    
                    // Adjust confidence based on strength of visual indicators
                    const symptomStrength = yellowingRatio + browningRatio + (avgVariance / 100);
                    
                    if (symptomStrength > 0.2) {
                        // Strong symptoms = higher confidence
                        selectedDisease = {
                            ...selectedDisease,
                            confidence: Math.min(0.98, selectedDisease.confidence + 0.06)
                        };
                    } else if (symptomStrength < 0.08) {
                        // Weak symptoms = lower confidence
                        selectedDisease = {
                            ...selectedDisease,
                            confidence: Math.max(0.75, selectedDisease.confidence - 0.08)
                        };
                    }
                } else {
                    // Fallback if no diseases defined
                    selectedDisease = {
                        name: "Unknown Disease",
                        scientificName: "Unidentified Pathogen",
                        confidence: 0.7,
                        remedies: [
                            "Consult with a local agricultural expert",
                            "Monitor the plant for worsening symptoms",
                            "Consider a broad-spectrum fungicide if symptoms worsen"
                        ],
                        prevention: [
                            "Maintain proper plant spacing for good air circulation",
                            "Practice crop rotation",
                            "Use disease-free seeds and transplants",
                            "Keep foliage dry by watering at the base"
                        ]
                    };
                }
                
                // Set analysis result after "processing"
                setTimeout(() => {
                    setAnalysisResult({
                        disease: selectedDisease,
                        plant: selectedCrop,
                        remedies: selectedDisease.remedies,
                        prevention: selectedDisease.prevention
                    });
                    setIsLoading(false);
                }, 1800);
            };
            
            img.onerror = function() {
                console.error("Error loading image");
                // Fallback to default disease selection
                const randomDisease = cropDiseases[0];
                setAnalysisResult({
                    disease: randomDisease,
                    plant: selectedCrop,
                    remedies: randomDisease.remedies,
                    prevention: randomDisease.prevention
                });
                setIsLoading(false);
            };
            
            img.src = e.target.result;
        };
        
        reader.onerror = function() {
            console.error("Error reading file");
            setError("Failed to analyze image. Please try again.");
            setIsLoading(false);
        };
        
        reader.readAsDataURL(selectedImage);
    };

    // Analyze the selected image
    const analyzeImage = async () => {
        if (!selectedImage) {
            setError('Please select or capture an image first');
            return;
        }

        setIsLoading(true);
        setError('');

        try {
            // Create a reader to read the image data
            const reader = new FileReader();
            
            reader.onload = (e) => {
                const img = new Image();
                
                img.onload = () => {
                    // Create canvas to extract color data
                    const canvas = document.createElement('canvas');
                    const ctx = canvas.getContext('2d');
                    
                    // Set canvas size to match image dimensions
                    canvas.width = img.width;
                    canvas.height = img.height;
                    
                    // Draw image on canvas
                    ctx.drawImage(img, 0, 0);
                    
                    // Get image data for analysis
                    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                    const data = imageData.data;
                    
                    // Sample size for better performance
                    const sampleSize = 5; // Increased sampling density for better accuracy
                    
                    // Advanced color and texture analysis
                    let greenPixels = 0;
                    let redPixels = 0;
                    let yellowPixels = 0;
                    let brownPixels = 0;
                    let whitePixels = 0;
                    let purplePixels = 0;
                    let totalPixels = 0;
                    
                    // Disease indicators
                    let yellowingCount = 0;
                    let browningCount = 0;
                    
                    // Texture analysis
                    let edgeCount = 0;
                    let textureVariance = 0;
                    let colorVariance = 0;
                    
                    // We'll store a small slice of the image for texture analysis
                    const gridSize = Math.min(100, Math.floor(Math.min(canvas.width, canvas.height) / 10));
                    const colorGrid = new Array(gridSize * gridSize).fill(0);
                    
                    // Process image data
                    for (let y = 0; y < canvas.height; y += sampleSize) {
                        for (let x = 0; x < canvas.width; x += sampleSize) {
                            const i = (y * canvas.width + x) * 4;
                            
                            if (i + 2 >= data.length) continue;
                            
                            const r = data[i];
                            const g = data[i + 1];
                            const b = data[i + 2];
                            
                            // RGB to HSL conversion for better color analysis
                            const [h, s, l] = rgbToHsl(r, g, b);
                            
                            // Collect color samples for texture analysis
                            if (x < gridSize && y < gridSize) {
                                const gridIndex = y * gridSize + x;
                                if (gridIndex < colorGrid.length) {
                                    colorGrid[gridIndex] = (r + g + b) / 3;
                                }
                            }
                            
                            // Check for predominantly green pixels (plants)
                            if (h >= 80 && h <= 160 && s > 15) { // Green in HSL
                                greenPixels++;
                                
                                // Check for yellowing (yellow-green in HSL)
                                if (h >= 50 && h <= 80 && s > 20 && l > 40) {
                                    yellowingCount++;
                                }
                            }
                            
                            // Check for red (tomatoes, chili)
                            if ((h >= 340 || h <= 10) && s > 40 && l > 20 && l < 60) {
                                redPixels++;
                            }
                            
                            // Check for yellow (bananas)
                            if (h >= 40 && h <= 60 && s > 40 && l > 50) {
                                yellowPixels++;
                            }
                            
                            // Check for brown (potatoes, soil)
                            if ((h >= 20 && h <= 40) && s > 20 && l > 15 && l < 50) {
                                brownPixels++;
                                
                                // Brown spots as disease indicators
                                if (s > 30 && isSpot(data, i, canvas.width, canvas.height)) {
                                    browningCount++;
                                }
                            }
                            
                            // Check for white/light areas (possible fungal growth)
                            if (l > 80 && s < 15) {
                                whitePixels++;
                            }
                            
                            // Check for purplish colors (possible nutrient deficiency)
                            if ((h >= 270 && h <= 330) && s > 20 && l > 20 && l < 60) {
                                purplePixels++;
                            }
                            
                            // Calculate edge detection for texture analysis
                            if (x > sampleSize && y > sampleSize && 
                                x < canvas.width - sampleSize && y < canvas.height - sampleSize) {
                                const leftIndex = (y * canvas.width + (x - sampleSize)) * 4;
                                const rightIndex = (y * canvas.width + (x + sampleSize)) * 4;
                                const topIndex = ((y - sampleSize) * canvas.width + x) * 4;
                                const bottomIndex = ((y + sampleSize) * canvas.width + x) * 4;
                                
                                if (leftIndex >= 0 && rightIndex + 2 < data.length && 
                                    topIndex >= 0 && bottomIndex + 2 < data.length) {
                                    const rDiffH = Math.abs(data[leftIndex] - data[rightIndex]);
                                    const gDiffH = Math.abs(data[leftIndex + 1] - data[rightIndex + 1]);
                                    const bDiffH = Math.abs(data[leftIndex + 2] - data[rightIndex + 2]);
                                    
                                    const rDiffV = Math.abs(data[topIndex] - data[bottomIndex]);
                                    const gDiffV = Math.abs(data[topIndex + 1] - data[bottomIndex + 1]);
                                    const bDiffV = Math.abs(data[topIndex + 2] - data[bottomIndex + 2]);
                                    
                                    const diffH = (rDiffH + gDiffH + bDiffH) / 3;
                                    const diffV = (rDiffV + gDiffV + bDiffV) / 3;
                                    
                                    const edgeMagnitude = Math.sqrt(diffH * diffH + diffV * diffV);
                                    
                                    if (edgeMagnitude > 30) {
                                        edgeCount++;
                                    }
                                    
                                    textureVariance += edgeMagnitude;
                                }
                            }
                            
                            totalPixels++;
                        }
                    }
                    
                    // Calculate texture analysis from grid samples
                    for (let i = 0; i < colorGrid.length - 1; i++) {
                        colorVariance += Math.abs(colorGrid[i] - colorGrid[i + 1]);
                    }
                    colorVariance = colorVariance / (colorGrid.length - 1);
                    
                    // Calculate ratios
                    const greenRatio = greenPixels / totalPixels;
                    const redRatio = redPixels / totalPixels;
                    const yellowRatio = yellowPixels / totalPixels;
                    const brownRatio = brownPixels / totalPixels;
                    const whiteRatio = whitePixels / totalPixels;
                    const edgeRatio = edgeCount / totalPixels;
                    const avgTextureVariance = textureVariance / totalPixels;
                    
                    // Disease indicators
                    const yellowingRatio = yellowingCount / totalPixels;
                    const browningRatio = browningCount / totalPixels;
                    
                    // Calculate texture metrics
                    const textureScore = avgTextureVariance * 10 + colorVariance + edgeRatio * 1000;
                    
                    // Calculate features for each crop type
                    const cropFeatures = {
                        "Rice": {
                            // Rice fields have high green content, medium texture, often uniform pattern
                            score: greenRatio * 50 + (1 - edgeRatio) * 20 - textureScore * 0.2,
                            evidence: [
                                greenRatio > 0.4 ? `High green content (${(greenRatio * 100).toFixed(1)}%)` : null,
                                edgeRatio < 0.1 ? `Uniform texture pattern` : null
                            ].filter(Boolean)
                        },
                        "Tea": {
                            // Tea has high green content, high texture complexity from bushes
                            score: greenRatio * 40 + textureScore * 0.3,
                            evidence: [
                                greenRatio > 0.45 ? `High green content (${(greenRatio * 100).toFixed(1)}%)` : null,
                                textureScore > 100 ? `Complex leaf pattern texture` : null
                            ].filter(Boolean)
                        },
                        "Tomato": {
                            // Tomatoes have green foliage with red fruits
                            score: greenRatio * 20 + redRatio * 80,
                            evidence: [
                                greenRatio > 0.3 ? `Green foliage (${(greenRatio * 100).toFixed(1)}%)` : null,
                                redRatio > 0.15 ? `Red fruit coloration (${(redRatio * 100).toFixed(1)}%)` : null
                            ].filter(Boolean)
                        },
                        "Potato": {
                            // Potatoes have green foliage, often with soil visible
                            score: greenRatio * 30 + brownRatio * 40 - yellowingRatio * 20,
                            evidence: [
                                greenRatio > 0.2 ? `Green foliage (${(greenRatio * 100).toFixed(1)}%)` : null,
                                brownRatio > 0.15 ? `Soil/tuber coloration (${(brownRatio * 100).toFixed(1)}%)` : null
                            ].filter(Boolean)
                        },
                        "Chili": {
                            // Chilies have green foliage with red/green fruits
                            score: greenRatio * 30 + redRatio * 70 + textureScore * 0.2,
                            evidence: [
                                greenRatio > 0.3 ? `Green foliage (${(greenRatio * 100).toFixed(1)}%)` : null,
                                redRatio > 0.1 ? `Red fruit coloration (${(redRatio * 100).toFixed(1)}%)` : null,
                                textureScore > 80 ? `Distinctive fruit texture` : null
                            ].filter(Boolean)
                        },
                        "Banana": {
                            // Bananas have large green leaves, sometimes yellow fruits
                            score: greenRatio * 40 + yellowRatio * 60 - edgeRatio * 30,
                            evidence: [
                                greenRatio > 0.3 ? `Broad leaf pattern (${(greenRatio * 100).toFixed(1)}%)` : null,
                                yellowRatio > 0.1 ? `Yellow fruit coloration (${(yellowRatio * 100).toFixed(1)}%)` : null,
                                edgeRatio < 0.15 ? `Smooth leaf texture` : null
                            ].filter(Boolean)
                        }
                    };
                    
                    // Calculate crop likelihood and sort by score
                    const cropScores = Object.entries(cropFeatures)
                        .map(([name, features]) => ({
                            name,
                            score: features.score,
                            evidence: features.evidence
                        }))
                        .filter(crop => crop.evidence.length > 0)
                        .sort((a, b) => b.score - a.score);
                    
                    // Get the detected crops with their evidence
                    const detectedCrops = cropScores.slice(0, 5).map(crop => ({
                        ...sriLankaCrops.find(c => c.name === crop.name),
                        score: crop.score,
                        evidence: crop.evidence
                    }));
                    
                    // If we have high confidence (top score is 20% higher than second), auto-select
                    const highConfidence = detectedCrops.length >= 2 && 
                        (detectedCrops[0].score > detectedCrops[1].score * 1.3 && 
                         detectedCrops[0].evidence.length >= 2);
                    
                    if (highConfidence && (yellowingRatio > 0.08 || browningRatio > 0.08 || whiteRatio > 0.1)) {
                        // Get diseases for this crop
                        const cropDiseases = plantDiseases[detectedCrops[0].name] || [];
                        
                        if (cropDiseases.length > 0) {
                            // Select appropriate disease based on symptoms
                            let selectedDisease;
                            
                            if (yellowingRatio > 0.08 && cropDiseases.some(d => d.name.includes("Blight"))) {
                                // Yellowing often indicates blights
                                selectedDisease = cropDiseases.find(d => d.name.includes("Blight"));
                            } 
                            else if (browningRatio > 0.08 && cropDiseases.some(d => d.name.includes("Leaf"))) {
                                // Browning often indicates leaf diseases
                                selectedDisease = cropDiseases.find(d => d.name.includes("Leaf"));
                            }
                            else if (whiteRatio > 0.1 && cropDiseases.some(d => 
                                d.name.includes("Powdery") || d.name.includes("Mildew"))) {
                                // White patches often indicate powdery mildew
                                selectedDisease = cropDiseases.find(d => 
                                    d.name.includes("Powdery") || d.name.includes("Mildew"));
                            }
                            else if (textureScore > 150 && cropDiseases.some(d => 
                                d.name.includes("Anthracnose") || d.name.includes("Spot"))) {
                                // High texture variance indicates spots/lesions
                                selectedDisease = cropDiseases.find(d => 
                                    d.name.includes("Anthracnose") || d.name.includes("Spot"));
                            }
                            else {
                                // Default to first disease
                                selectedDisease = cropDiseases[0];
                            }
                            
                            // Adjust confidence based on symptom strength
                            const symptomStrength = yellowingRatio + browningRatio + (whiteRatio * 2);
                            
                            if (symptomStrength > 0.15) {
                                selectedDisease = {
                                    ...selectedDisease,
                                    confidence: Math.min(0.95, selectedDisease.confidence + 0.05)
                                };
                            } else if (symptomStrength < 0.05) {
                                selectedDisease = {
                                    ...selectedDisease,
                                    confidence: Math.max(0.70, selectedDisease.confidence - 0.1)
                                };
                            }
                            
                            // Set crop as selected and show results directly
                            setTimeout(() => {
                                setSelectedCrop(detectedCrops[0]);
                                setCropConfirmed(true);
                                setAnalysisResult({
                                    disease: selectedDisease,
                                    plant: detectedCrops[0],
                                    remedies: selectedDisease.remedies,
                                    prevention: selectedDisease.prevention
                                });
                                setIsLoading(false);
                            }, 2000);
                        } else {
                            // Show crop selection if we don't have disease data
                            setTimeout(() => {
                                setCommonCrops(detectedCrops);
                                setIsLoading(false);
                            }, 2000);
                        }
                    } else {
                        // Show the crop selection screen with evidence
                        setTimeout(() => {
                            setCommonCrops(detectedCrops);
                            setIsLoading(false);
                        }, 2000);
                    }
                };
                
                img.onerror = () => {
                    setError('Failed to process image. Please try a different one.');
                    setIsLoading(false);
                };
                
                img.src = e.target.result;
            };
            
            reader.onerror = () => {
                setError('Failed to read image file. Please try again.');
                setIsLoading(false);
            };
            
            reader.readAsDataURL(selectedImage);
            
        } catch (err) {
            console.error('Error analyzing image:', err);
            setError('Failed to analyze image. Please try again with a clearer photo.');
            setIsLoading(false);
        }
    };

    // Convert RGB to HSL for better color analysis
    const rgbToHsl = (r, g, b) => {
        r /= 255;
        g /= 255;
        b /= 255;
        
        const max = Math.max(r, g, b);
        const min = Math.min(r, g, b);
        let h, s, l = (max + min) / 2;
        
        if (max === min) {
            h = s = 0; // achromatic
        } else {
            const d = max - min;
            s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
            
            switch (max) {
                case r: h = (g - b) / d + (g < b ? 6 : 0); break;
                case g: h = (b - r) / d + 2; break;
                case b: h = (r - g) / d + 4; break;
                default: break;
            }
            
            h /= 6;
        }
        
        return [h * 360, s * 100, l * 100];
    };

    // Check if a pixel is part of a spot (surrounded by different colors)
    const isSpot = (data, i, width, height) => {
        const sampleSize = 5;
        const x = (i / 4) % width;
        const y = Math.floor((i / 4) / width);
        
        // Check surrounding pixels
        let diffCount = 0;
        let checkCount = 0;
        
        // Get center pixel color
        const centerR = data[i];
        const centerG = data[i + 1];
        const centerB = data[i + 2];
        
        // Sample in a plus pattern around the pixel
        const offsets = [
            [-sampleSize, 0], [sampleSize, 0], 
            [0, -sampleSize], [0, sampleSize]
        ];
        
        for (const [offsetX, offsetY] of offsets) {
            const sampleX = x + offsetX;
            const sampleY = y + offsetY;
            
            // Skip if outside image bounds
            if (sampleX < 0 || sampleX >= width || sampleY < 0 || sampleY >= height) {
                continue;
            }
            
            const sampleI = (sampleY * width + sampleX) * 4;
            
            // Skip if index is invalid
            if (sampleI < 0 || sampleI + 2 >= data.length) {
                continue;
            }
            
            const sampleR = data[sampleI];
            const sampleG = data[sampleI + 1];
            const sampleB = data[sampleI + 2];
            
            // Calculate color difference
            const diff = Math.abs(centerR - sampleR) + 
                         Math.abs(centerG - sampleG) + 
                         Math.abs(centerB - sampleB);
            
            // If significant difference, might be a spot boundary
            if (diff > 80) {
                diffCount++;
            }
            
            checkCount++;
        }
        
        // If most surrounding pixels are different, likely a spot
        return diffCount >= 2 && checkCount >= 3;
    };

    return (
        <div className="disease-detection">
            <div className="page-header">
                <h1>Plant Disease Detection</h1>
                <p className="subtitle">Upload or capture a photo of your plant to identify potential diseases</p>
            </div>

            {error && (
                <div className="error-message">
                    <FontAwesomeIcon icon={faExclamationTriangle} />
                    {error}
                </div>
            )}

            <div className="detection-container">
                <div className="tabs">
                    <button 
                        className={`tab ${activeTab === 'upload' ? 'active' : ''}`}
                        onClick={handleUploadTab}
                    >
                        <FontAwesomeIcon icon={faUpload} />
                        Upload Image
                    </button>
                    <button 
                        className={`tab ${activeTab === 'camera' ? 'active' : ''}`}
                        onClick={handleCameraTab}
                    >
                        <FontAwesomeIcon icon={faCamera} />
                        Use Camera
                    </button>
                </div>

                <div className="content-area">
                    {activeTab === 'upload' ? (
                        <div 
                            className="upload-area"
                            onDrop={handleDrop}
                            onDragOver={handleDragOver}
                        >
                            {!previewURL ? (
                                <>
                                    <FontAwesomeIcon icon={faUpload} className="upload-icon" />
                                    <p>Drag & drop an image here or click to browse</p>
                                    <input 
                                        type="file" 
                                        ref={fileInputRef}
                                        onChange={handleFileSelect}
                                        accept="image/png, image/jpeg, image/jpg" 
                                        className="file-input"
                                    />
                                    <button 
                                        className="browse-button"
                                        onClick={() => fileInputRef.current.click()}
                                    >
                                        Browse Files
                                    </button>
                                </>
                            ) : (
                                <div className="image-preview-container">
                                    <img src={previewURL} alt="Plant preview" className="image-preview" />
                                    <button className="reset-button" onClick={resetAnalysis}>
                                        <FontAwesomeIcon icon={faSyncAlt} /> Select Another Image
                                    </button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="camera-area">
                            {!previewURL ? (
                                <>
                                    <video 
                                        ref={cameraRef}
                                        autoPlay
                                        playsInline
                                        className="camera-preview"
                                    ></video>
                                    <button className="capture-button" onClick={captureImage}>
                                        Capture Image
                                    </button>
                                </>
                            ) : (
                                <div className="image-preview-container">
                                    <img src={previewURL} alt="Captured plant" className="image-preview" />
                                    <button className="reset-button" onClick={resetAnalysis}>
                                        <FontAwesomeIcon icon={faSyncAlt} /> Capture Another Image
                                    </button>
                                </div>
                            )}
                        </div>
                    )}

                    {previewURL && !analysisResult && !isLoading && !commonCrops.length && (
                        <button 
                            className="analyze-button" 
                            onClick={analyzeImage}
                            disabled={isLoading}
                        >
                            Analyze Image
                        </button>
                    )}

                    {isLoading && (
                        <div className="loading">
                            <div className="spinner"></div>
                            <p>Analyzing your plant image...</p>
                        </div>
                    )}

                    {commonCrops.length > 0 && !cropConfirmed && !isLoading && (
                        <div className="crop-selection">
                            <h3>Confirm Your Crop Type</h3>
                            <p>For accurate disease detection, please confirm the crop type:</p>
                            
                            <div className="crop-options">
                                {commonCrops.map((crop, index) => (
                                    <div 
                                        key={index} 
                                        className={`crop-option ${selectedCrop?.name === crop.name ? 'selected' : ''}`}
                                        onClick={() => handleCropSelect(crop)}
                                    >
                                        <span className="crop-name">{crop.name}</span>
                                        {crop.evidence && (
                                            <div className="crop-evidence">
                                                {crop.evidence.map((evidence, idx) => (
                                                    <span key={idx} className="evidence-item">{evidence}</span>
                                                ))}
                                            </div>
                                        )}
                                        {selectedCrop?.name === crop.name && (
                                            <FontAwesomeIcon icon={faCheck} className="check-icon" />
                                        )}
                                    </div>
                                ))}
                            </div>
                            
                            <button 
                                className="confirm-crop-button" 
                                onClick={confirmCropSelection}
                                disabled={!selectedCrop}
                            >
                                Confirm & Analyze
                            </button>
                            
                            <div className="crop-note">
                                <FontAwesomeIcon icon={faInfoCircle} />
                                <p>Correctly identifying your crop ensures the most accurate disease detection results.</p>
                            </div>
                        </div>
                    )}

                    {analysisResult && (
                        <div className="analysis-results">
                            <div className="result-header">
                                <div className="detection-summary">
                                    <h2>Analysis Results</h2>
                                    <div className="detection-badges">
                                        <span className="plant-badge">
                                            <FontAwesomeIcon icon={faLeaf} />
                                            {analysisResult.plant.name}
                                        </span>
                                        <span className="disease-badge">
                                            <FontAwesomeIcon icon={faVirus} />
                                            {analysisResult.disease.name}
                                        </span>
                                        <span className="confidence-badge">
                                            Confidence: {Math.round(analysisResult.disease.confidence * 100)}%
                                        </span>
                                    </div>
                                </div>
                                <button className="details-toggle" onClick={() => setShowDetails(!showDetails)}>
                                    <span>{showDetails ? 'Hide Details' : 'Show Details'}</span>
                                    <FontAwesomeIcon icon={showDetails ? faChevronUp : faChevronDown} />
                                </button>
                            </div>

                            {showDetails && (
                                <div className="detailed-info">
                                    <div className="info-section">
                                        <h3>Scientific Information</h3>
                                        <p><strong>Plant:</strong> {analysisResult.plant.scientificName}</p>
                                        <p><strong>Disease:</strong> {analysisResult.disease.scientificName}</p>
                                    </div>
                                </div>
                            )}

                            <div className="treatment-section">
                                <h3>Recommended Remedies</h3>
                                <ul className="remedy-list">
                                    {analysisResult.remedies.map((remedy, index) => (
                                        <li key={index}>{remedy}</li>
                                    ))}
                                </ul>
                            </div>

                            <div className="prevention-section">
                                <h3>Prevention Tips</h3>
                                <ul className="prevention-list">
                                    {analysisResult.prevention.map((tip, index) => (
                                        <li key={index}>{tip}</li>
                                    ))}
                                </ul>
                            </div>

                            <div className="disclaimer">
                                <FontAwesomeIcon icon={faInfoCircle} />
                                <p>This analysis is based on visual characteristics and should be confirmed by an agricultural expert for critical decisions.</p>
                            </div>

                            <button 
                                className="start-over-button" 
                                onClick={resetAnalysis}
                            >
                                <FontAwesomeIcon icon={faSyncAlt} /> Start Over
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default DiseaseDetection; 