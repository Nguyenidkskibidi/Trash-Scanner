import { GoogleGenAI, Type } from '@google/genai';
import type { WasteInfo, QuizQuestion, ChatMessage, Language } from '../types';

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const getLocalizedSchemaDescriptions = (language: Language) => {
    const isVi = language === 'vi';
    return {
        wasteType: isVi ? 'Tên phổ biến của vật thể (ví dụ: "Chai nước nhựa", "Báo cũ", hoặc "Human" nếu phát hiện người).' : 'Common name of the object (e.g., "Plastic bottle", "Old newspaper", or "Human" if a person is detected).',
        material: isVi ? 'Vật liệu chính của vật thể (ví dụ: "Nhựa PET", "Giấy", "Con người").' : 'Main material of the object (e.g., "PET Plastic", "Paper", "Human").',
        recyclable: isVi ? 'Vật thể có thể tái chế được không. "Conditional" có nghĩa là tùy thuộc vào cơ sở địa phương. Đối với con người, hãy trả về "Yes".' : 'Is the object recyclable. "Conditional" means it depends on local facilities. For humans, return "Yes".',
        disposalInstructions: isVi ? 'Hướng dẫn xử lý rác thải. Nếu phát hiện người, hãy trả về một lời khen ngợi thân thiện và độc đáo.' : 'Instructions for waste disposal. If a person is detected, return a friendly and unique compliment.',
        funFact: isVi ? 'Một sự thật thú vị. Nếu phát hiện người, hãy cung cấp một sự thật thú vị về con người.' : 'An interesting fun fact. If a person is detected, provide a fun fact about humans.',
        imageUrl: isVi ? 'URL hình ảnh minh họa chất lượng cao, có thể truy cập công khai của vật thể rác, lý tưởng nhất là trên nền trắng hoặc nền đơn giản. URL phải dẫn trực tiếp đến tệp hình ảnh (ví dụ: .jpg, .png). Nếu phát hiện người hoặc không tìm thấy ảnh phù hợp, hãy trả về một chuỗi rỗng.' : 'A high-quality, publicly accessible URL of an illustrative image of the waste object, ideally on a white or simple background. The URL must lead directly to the image file (e.g., .jpg, .png). If a person is detected or no suitable image is found, return an empty string.',
        quizItemName: isVi ? "Tên của vật thể rác hoặc khái niệm." : "The name of the waste item or concept.",
        quizImagePrompt: isVi ? "Tùy chọn. Một prompt ngắn gọn, rõ ràng để tạo ra hình ảnh của vật thể trên nền trắng. CHỈ cung cấp cho một số câu hỏi đầu tiên." : "Optional. A short, clear prompt to generate a picture of the item on a white background. ONLY provide for the first few questions.",
        quizQuestionText: isVi ? "Câu hỏi trắc nghiệm về cách xử lý vật thể này hoặc một khái niệm liên quan." : "A multiple-choice question about how to dispose of this item or a related concept.",
        quizOptions: isVi ? "Một mảng gồm 3-4 lựa chọn trả lời." : "An array of 3-4 answer choices.",
        quizCorrectAnswer: isVi ? "Câu trả lời đúng chính xác từ mảng lựa chọn." : "The exact correct answer from the options array.",
        quizExplanation: isVi ? "Một lời giải thích ngắn gọn tại sao câu trả lời đó lại đúng." : "A brief explanation of why the answer is correct."
    };
};

const generateWasteInfoSchema = (language: Language) => {
    const d = getLocalizedSchemaDescriptions(language);
    return {
        type: Type.OBJECT,
        properties: {
            wasteType: { type: Type.STRING, description: d.wasteType },
            material: { type: Type.STRING, description: d.material },
            recyclable: { type: Type.STRING, enum: ['Yes', 'No', 'Conditional'], description: d.recyclable },
            disposalInstructions: { type: Type.STRING, description: d.disposalInstructions },
            funFact: { type: Type.STRING, description: d.funFact },
            imageUrl: { type: Type.STRING, description: d.imageUrl },
        },
        required: ['wasteType', 'material', 'recyclable', 'disposalInstructions', 'funFact', 'imageUrl'],
    };
};

const generateQuizSchema = (language: Language) => {
    const d = getLocalizedSchemaDescriptions(language);
    const quizQuestionSchema = {
        type: Type.OBJECT,
        properties: {
            itemName: { type: Type.STRING, description: d.quizItemName },
            imagePrompt: { type: Type.STRING, description: d.quizImagePrompt },
            questionText: { type: Type.STRING, description: d.quizQuestionText },
            options: { type: Type.ARRAY, description: d.quizOptions, items: { type: Type.STRING } },
            correctAnswer: { type: Type.STRING, description: d.quizCorrectAnswer },
            explanation: { type: Type.STRING, description: d.quizExplanation }
        },
        required: ["itemName", "questionText", "options", "correctAnswer", "explanation"]
    };
    return {
        type: Type.ARRAY,
        items: quizQuestionSchema,
    };
};


export async function analyzeImage(base64Image: string, expertMode: boolean = false, language: Language): Promise<WasteInfo[]> {
  const isVi = language === 'vi';
  const wasteInfoSchema = generateWasteInfoSchema(language);
  const imageAnalysisSchema = { type: Type.ARRAY, items: wasteInfoSchema };
  
  const expertInstructions = expertMode
    ? (isVi
      ? `Cung cấp thông tin ở mức độ chuyên gia. Trong 'disposalInstructions', hãy bao gồm các chi tiết kỹ thuật như mã tái chế (ví dụ: PET 1, HDPE 2) và các quy trình xử lý công nghiệp. Trong 'funFact', hãy cung cấp các dữ kiện khoa học hoặc thống kê chuyên sâu.`
      : `Provide expert-level information. In 'disposalInstructions', include technical details like recycling codes (e.g., PET 1, HDPE 2) and industrial processes. In 'funFact', provide in-depth scientific facts or statistics.`)
    : (isVi
      ? `Cung cấp thông tin dễ hiểu cho người dùng phổ thông.`
      : `Provide easy-to-understand information for the average user.`);

  const imagePart = {
    inlineData: {
      mimeType: 'image/jpeg',
      data: base64Image,
    },
  };

  const textPart = {
    text: isVi ? `Bạn là một AI chuyên gia về môi trường với độ chính xác cực cao, chuyên xác định rác thải từ hình ảnh. Nhiệm vụ của bạn là phân tích hình ảnh được cung cấp và trả về một mảng JSON chứa thông tin về TẤT CẢ các vật thể rác được tìm thấy. Tuân thủ CỰC KỲ NGHIÊM NGẶT các quy tắc sau theo đúng thứ tự và trả lời bằng tiếng Việt:

1.  **QUY TẮC 1: ƯU TIÊN RÁC.** Luôn tìm kiếm vật thể rác trước tiên. Nếu phát hiện BẤT KỲ vật thể rác nào, câu trả lời của bạn BẮT BUỘC chỉ được chứa thông tin về (các) vật thể rác đó. TUYỆT ĐỐI bỏ qua bất kỳ người nào trong ảnh nếu có rác.
2.  **QUY TẮC 2: CHỈ CÓ NGƯỜI.** Nếu, và CHỈ NẾU, không có vật thể rác nào, bạn có thể xác định người. Trả về một đối tượng DUY NHẤT với 'wasteType' là "Human", và điền các trường khác với thông tin tích cực.
3.  **QUY TẮC 3: ẢNH RỖNG.** Nếu ảnh không chứa rác hoặc người, hãy trả về một mảng JSON rỗng [].
4.  **QUY TẮC 4: URL HÌNH ẢNH CHẤT LƯỢNG.** Đối với mỗi vật thể rác, bạn BẮT BUỘC phải tìm một URL hình ảnh minh họa chất lượng cao. URL này PHẢI trỏ trực tiếp đến tệp hình ảnh.

**Yêu cầu bổ sung:** ${expertInstructions}
Câu trả lời của bạn BẮT BUỘC chỉ được là một mảng JSON.`
    : `You are a highly accurate environmental expert AI specializing in identifying waste from images. Your task is to analyze the provided image and return a JSON array containing information about ALL waste objects found. Strictly follow these rules in order and respond in English:

1.  **RULE 1: WASTE PRIORITY.** Always look for waste objects first. If ANY waste object is detected, your response MUST only contain information about the waste object(s). ABSOLUTELY ignore any person in the image if waste is present.
2.  **RULE 2: PERSON ONLY.** If, and ONLY IF, no waste objects are in the image, you may identify a person. Return a SINGLE object with 'wasteType' as "Human", and fill the other fields with positive information.
3.  **RULE 3: EMPTY IMAGE.** If the image contains no clear waste or people, return an empty JSON array [].
4.  **RULE 4: QUALITY IMAGE URL.** For each waste item, you MUST find a high-quality, illustrative image URL. The URL MUST point directly to an image file.

**Additional Requirement:** ${expertInstructions}
Your response MUST be only a JSON array.`
  };

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: { parts: [imagePart, textPart] },
    config: {
      responseMimeType: "application/json",
      responseSchema: imageAnalysisSchema,
      temperature: 0.5,
      thinkingConfig: { thinkingBudget: 0 },
    },
  });

  const jsonText = response.text.trim();
  const parsedJson = JSON.parse(jsonText);
  
  if (!Array.isArray(parsedJson)) {
      throw new Error("Invalid response format from API, expected an array.");
  }

  return parsedJson as WasteInfo[];
}

export async function searchWasteInfo(query: string, expertMode: boolean = false, language: Language): Promise<WasteInfo[]> {
    const isVi = language === 'vi';
    const wasteInfoSchema = generateWasteInfoSchema(language);
    const textSearchSchema = { type: Type.ARRAY, items: wasteInfoSchema };

    const expertInstructions = expertMode
    ? (isVi
      ? `Cung cấp thông tin ở mức độ chuyên gia. Trong 'disposalInstructions', bao gồm chi tiết kỹ thuật như mã tái chế. Trong 'funFact', cung cấp dữ kiện khoa học chuyên sâu.`
      : `Provide expert-level information. In 'disposalInstructions', include technical details like recycling codes. In 'funFact', provide in-depth scientific facts.`)
    : (isVi
      ? `Cung cấp thông tin dễ hiểu cho người dùng phổ thông.`
      : `Provide easy-to-understand information for the average user.`);

    const prompt = isVi ? `Bạn là một AI trợ lý chuyên gia về môi trường. Dựa trên truy vấn tìm kiếm của người dùng: "${query}", hãy cung cấp thông tin phân loại rác chi tiết và chính xác bằng tiếng Việt.
      1. **Xác định:** Phân tích truy vấn để xác định (các) vật thể rác chính.
      2. **Thu thập dữ liệu:** Cung cấp thông tin chi tiết cho TỪNG vật thể. ${expertInstructions}
      3. **Tìm hình ảnh:** Đối với MỖI vật thể, tìm một URL hình ảnh minh họa chất lượng cao. URL PHẢI là một liên kết trực tiếp đến tệp ảnh.
      4. **Định dạng:** Chỉ trả lời bằng một mảng JSON. Nếu không có kết quả, trả về [].`
    : `You are an expert environmental AI assistant. Based on the user's search query: "${query}", provide detailed and accurate waste classification information in English.
      1. **Identify:** Analyze the query to identify the main waste object(s).
      2. **Gather Data:** Provide detailed info for EACH object. ${expertInstructions}
      3. **Find Image:** For EACH object, find a high-quality, illustrative image URL. The URL MUST be a direct link to an image file.
      4. **Format:** Respond only with a JSON array. If no results, return [].`;

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: { parts: [{ text: prompt }] },
    config: {
      responseMimeType: "application/json",
      responseSchema: textSearchSchema,
      temperature: 0.2,
    },
  });

  const responseJson = JSON.parse(response.text.trim());
  
  if (!Array.isArray(responseJson)) {
      return [];
  }

  return responseJson as WasteInfo[];
}

export async function generateQuizQuestions(difficulty: 'easy' | 'medium' | 'hard', language: Language): Promise<QuizQuestion[]> {
  const isVi = language === 'vi';
  const quizSchema = generateQuizSchema(language);
  
  const difficultyConfig = {
    easy: { questions: 10, imageQuestions: 5, level: isVi ? 'dễ, phù hợp với người mới bắt đầu' : 'easy, suitable for beginners' },
    medium: { questions: 15, imageQuestions: 7, level: isVi ? 'trung bình, phù hợp với người dùng phổ thông' : 'of medium difficulty, suitable for a general audience' },
    hard: { questions: 20, imageQuestions: 10, level: isVi ? 'khó, dành cho chuyên gia, bao gồm các chi tiết kỹ thuật' : 'difficult, expert-level, including technical details' },
  };

  const config = difficultyConfig[difficulty];

  const prompt = isVi ? `Tạo một bài trắc nghiệm gồm ${config.questions} câu hỏi về phân loại và tái chế rác thải bằng tiếng Việt.
- Các câu hỏi phải ở mức độ ${config.level}.
- ${config.imageQuestions} câu hỏi ĐẦU TIÊN phải về các vật thể cụ thể và PHẢI có một 'imagePrompt'.
- ${config.questions - config.imageQuestions} câu hỏi SAU CÙNG phải là câu hỏi kiến thức chung và KHÔNG được có 'imagePrompt'.
CHỈ trả lời bằng một mảng JSON.`
  : `Create a quiz of ${config.questions} questions about waste classification and recycling in English.
- The questions must be ${config.level} difficulty.
- The FIRST ${config.imageQuestions} questions must be about specific items and MUST have an 'imagePrompt'.
- The LAST ${config.questions - config.imageQuestions} questions must be general knowledge and must NOT have an 'imagePrompt'.
ONLY respond with a JSON array.`;

  const contentResponse = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: { parts: [{ text: prompt }]},
    config: {
      responseMimeType: "application/json",
      responseSchema: quizSchema,
      temperature: 0.8,
    },
  });
  
  const quizContent: any[] = JSON.parse(contentResponse.text.trim());
  const questionsWithImagePrompts = quizContent.filter(q => q.imagePrompt && q.imagePrompt.trim() !== '');
  const questionsWithoutImagePrompts = quizContent.filter(q => !q.imagePrompt || q.imagePrompt.trim() === '');

  const imageUrls: string[] = [];
  for (const question of questionsWithImagePrompts) {
    try {
      const imageResponse = await ai.models.generateImages({
        model: 'imagen-4.0-generate-001',
        prompt: question.imagePrompt,
        config: {
          numberOfImages: 1,
          outputMimeType: 'image/png',
          aspectRatio: '1:1',
        },
      });

      let base64ImageBytes = '';
      if (imageResponse.generatedImages && imageResponse.generatedImages.length > 0 && imageResponse.generatedImages[0].image?.imageBytes) {
          base64ImageBytes = imageResponse.generatedImages[0].image.imageBytes;
      }
      
      if (base64ImageBytes) {
          imageUrls.push(`data:image/png;base64,${base64ImageBytes}`);
      } else {
          imageUrls.push('');
      }
    } catch (err) {
      console.error("Image generation failed for prompt:", question.imagePrompt, err);
      imageUrls.push('');
    }
  }

  const finalQuestionsWithImages: QuizQuestion[] = questionsWithImagePrompts.map((questionData, index) => ({
    ...questionData,
    imageUrl: imageUrls[index],
  }));

  const combinedQuiz = [...finalQuestionsWithImages, ...questionsWithoutImagePrompts];

  return combinedQuiz.sort(() => Math.random() - 0.5);
}

export async function continueChat(
  history: ChatMessage[],
  wasteType: string,
  language: Language
): Promise<string> {
  const isVi = language === 'vi';
  const formattedHistory = history.map(msg => ({
    role: msg.role,
    parts: [{ text: msg.text }]
  }));

  const systemInstruction = isVi
    ? `Bạn là một AI trợ lý môi trường thân thiện và hữu ích, chuyên gia về loại rác có tên "${wasteType}". Nhiệm vụ của bạn là trả lời các câu hỏi của người dùng về vật thể này một cách ngắn gọn, dễ hiểu và chính xác bằng tiếng Việt. Không bao giờ thay đổi chủ đề.`
    : `You are a friendly and helpful environmental AI assistant, an expert on the waste type named "${wasteType}". Your task is to answer user questions about this item concisely, simply, and accurately in English. Never change the topic.`;

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: formattedHistory,
    config: {
      systemInstruction,
      temperature: 0.7,
    },
  });

  return response.text;
}