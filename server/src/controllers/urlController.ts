// import { Request, Response } from "express";
// import validator from 'validator'
// import { prisma } from '../lib/prisma.js';

// // Input URL
// export const url = async (req: Request, res: Response) => {
//   try {
//     const { url } = req.body;
//     const userId = (req as any).user.id;

//     if (!url) {
//       return res.status(400).json({
//         success: false,
//         message: "URL is required"
//       });
//     }

//     if (!validator.isURL(url, {
//       protocols: ['http', 'https'],
//       require_protocol: true,
//       require_valid_protocol: true
//     })) {
//       return res.status(400).json({
//         success: false,
//         message: "Invalid URL format. Must start with http:// or https://"
//       });
//     }

//     const newUrl = await prisma.url.create({
//       data: {
//         url,
//         user: {
//           connect: { id: userId }
//         }
//       },
//     });

//     return res.status(201).json({
//       success: true,
//       message: "URL created successfully",
//       data: newUrl
//     });

//   } catch (error) {
//     console.error("Create URL error:", error);
//     return res.status(500).json({
//       success: false,
//       message: "Internal server error"
//     });
//   }
// };

// // Generate code
// const generateShortCode = (length: number = 6): string => {
//   const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
//   let result = '';
//   for (let i = 0; i < length; i++) {
//     result += chars.charAt(Math.floor(Math.random() * chars.length));
//   }
//   return result;
// };

// // Shorten URL
// export const shorturl = async (req: Request, res: Response) => {
//   try {
//     const { url } = req.body;
//     const userId = (req as any).user.id;

//     if (!url) {
//       return res.status(400).json({
//         success: false,
//         message: "URL is required"
//       });
//     }

//     if (!validator.isURL(url, {
//       protocols: ['http', 'https'],
//       require_protocol: true,
//       require_valid_protocol: true
//     })) {
//       return res.status(400).json({
//         success: false,
//         message: "Invalid URL format. Must start with http:// or https://"
//       });
//     }

//     const existingUrl = await prisma.url.findFirst({
//       where: {
//         url,
//         user_id: userId,
//         shortcode: { not: null }
//       }
//     });

//     if (existingUrl) {
//       return res.status(200).json({
//         success: true,
//         message: "URL already shortened",
//         data: existingUrl,
//         shortUrl: `${process.env.BASE_URL}/${existingUrl.shortcode}`
//       });
//     }


//     const urlWithoutShortcode = await prisma.url.findFirst({
//       where: {
//         url,
//         user_id: userId,
//         shortcode: null
//       }
//     });


//     let shortcode = generateShortCode();
//     let isUnique = false;

//     while (!isUnique) {
//       const existing = await prisma.url.findUnique({
//         where: { shortcode }
//       });

//       if (!existing) {
//         isUnique = true;
//       } else {
//         shortcode = generateShortCode();
//       }
//     }

//     let resultUrl;


//     if (urlWithoutShortcode) {
//       resultUrl = await prisma.url.update({
//         where: { id: urlWithoutShortcode.id },
//         data: { shortcode }
//       });
//     } else {
//       resultUrl = await prisma.url.create({
//         data: {
//           url,
//           shortcode,
//           user: {
//             connect: { id: userId }
//           }
//         },
//       });
//     }

//     return res.status(201).json({
//       success: true,
//       message: "URL shortened successfully",
//       data: resultUrl,
//       shortUrl: `${process.env.BASE_URL}/${shortcode}`
//     });

//   } catch (error) {
//     console.error("Shorten URL error:", error);
//     return res.status(500).json({
//       success: false,
//       message: "Internal server error"
//     });
//   }
// };

// export const redirect = async (req: Request, res: Response) => {
//   try {
//     const { shortcode } = req.params;
//     if (!shortcode) {
//       return res.status(400).json({
//         success: false,
//         message: "shortcode required"
//       })
//     }

//     const existingUrl = await prisma.url.findUnique({
//       where : {shortcode}
//     })
//     if(!existingUrl){
//       return res.status(400).json({
//         success: false,
//         message: "Url not found"
//       })
//     }

//     return res.redirect(301,existingUrl.url)
    

//   } catch (error) {
//     console.error("Redirect error:", error);
//     return res.status(500).json({
//       success: false,
//       message: "Internal server error"
//     });
//   }
// };

import { Request, Response } from "express";
import validator from 'validator';
import { prisma } from '../lib/prisma.js';
import { redisClient } from '../lib/redis.js';

// Cache TTL (Time To Live) - 24 hours in seconds
const CACHE_TTL = 86400;

// Input URL
export const url = async (req: Request, res: Response) => {
  try {
    const { url } = req.body;
    const userId = (req as any).user.id;

    if (!url) {
      return res.status(400).json({
        success: false,
        message: "URL is required"
      });
    }

    if (!validator.isURL(url, {
      protocols: ['http', 'https'],
      require_protocol: true,
      require_valid_protocol: true
    })) {
      return res.status(400).json({
        success: false,
        message: "Invalid URL format. Must start with http:// or https://"
      });
    }

    const newUrl = await prisma.url.create({
      data: {
        url,
        user: {
          connect: { id: userId }
        }
      },
    });

    return res.status(201).json({
      success: true,
      message: "URL created successfully",
      data: newUrl
    });

  } catch (error) {
    console.error("Create URL error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};

// Generate code
const generateShortCode = (length: number = 6): string => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

// Shorten URL
export const shorturl = async (req: Request, res: Response) => {
  try {
    const { url } = req.body;
    const userId = (req as any).user.id;

    if (!url) {
      return res.status(400).json({
        success: false,
        message: "URL is required"
      });
    }

    if (!validator.isURL(url, {
      protocols: ['http', 'https'],
      require_protocol: true,
      require_valid_protocol: true
    })) {
      return res.status(400).json({
        success: false,
        message: "Invalid URL format. Must start with http:// or https://"
      });
    }

    const existingUrl = await prisma.url.findFirst({
      where: {
        url,
        user_id: userId,
        shortcode: { not: null }
      }
    });

    if (existingUrl) {
      // Cache the existing shortcode
      if (existingUrl.shortcode) {
        await redisClient.setEx(
          `shortcode:${existingUrl.shortcode}`,
          CACHE_TTL,
          existingUrl.url
        );
      }

      return res.status(200).json({
        success: true,
        message: "URL already shortened",
        data: existingUrl,
        shortUrl: `${process.env.BASE_URL}/${existingUrl.shortcode}`
      });
    }

    const urlWithoutShortcode = await prisma.url.findFirst({
      where: {
        url,
        user_id: userId,
        shortcode: null
      }
    });

    let shortcode = generateShortCode();
    let isUnique = false;

    while (!isUnique) {
      // Check both Redis and database for uniqueness
      const [cachedUrl, existingInDb] = await Promise.all([
        redisClient.get(`shortcode:${shortcode}`),
        prisma.url.findUnique({ where: { shortcode } })
      ]);

      if (!cachedUrl && !existingInDb) {
        isUnique = true;
      } else {
        shortcode = generateShortCode();
      }
    }

    let resultUrl;

    if (urlWithoutShortcode) {
      resultUrl = await prisma.url.update({
        where: { id: urlWithoutShortcode.id },
        data: { shortcode }
      });
    } else {
      resultUrl = await prisma.url.create({
        data: {
          url,
          shortcode,
          user: {
            connect: { id: userId }
          }
        },
      });
    }

    // Cache the new shortcode mapping
    await redisClient.setEx(
      `shortcode:${shortcode}`,
      CACHE_TTL,
      url
    );

    return res.status(201).json({
      success: true,
      message: "URL shortened successfully",
      data: resultUrl,
      shortUrl: `${process.env.BASE_URL}/${shortcode}`
    });

  } catch (error) {
    console.error("Shorten URL error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};

export const redirect = async (req: Request, res: Response) => {
  try {
    const { shortcode } = req.params;
    
    if (!shortcode) {
      return res.status(400).json({
        success: false,
        message: "shortcode required"
      });
    }

    // Try to get URL from Redis cache first
    const cachedUrl = await redisClient.get(`shortcode:${shortcode}`);
    
    if (cachedUrl) {
      // Increment visit counter in background (fire and forget)
      redisClient.incr(`visits:${shortcode}`).catch(err => 
        console.error('Redis incr error:', err)
      );
      
      console.log('Cache HIT for shortcode:', shortcode);
      return res.redirect(301, cachedUrl);
    }

    // Cache miss - fetch from database
    console.log('Cache MISS for shortcode:', shortcode);
    const existingUrl = await prisma.url.findUnique({
      where: { shortcode }
    });

    if (!existingUrl) {
      return res.status(404).json({
        success: false,
        message: "URL not found"
      });
    }

    // Store in cache for future requests
    await redisClient.setEx(
      `shortcode:${shortcode}`,
      CACHE_TTL,
      existingUrl.url
    );

    // Increment visit counter
    await redisClient.incr(`visits:${shortcode}`);

    return res.redirect(301, existingUrl.url);

  } catch (error) {
    console.error("Redirect error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};