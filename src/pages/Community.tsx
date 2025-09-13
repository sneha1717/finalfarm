import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { MessageCircle, Heart, Send, Clock, Trash2, Leaf, Sprout, Sun, Users, ThumbsUp, ThumbsDown } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';

type Post = { 
  id: string;
  text: string;
  likes: number;
  author: string;
  timestamp: string;
  replies: Reply[];
  category: 'general' | 'support' | 'advice' | 'celebration';
};

type Reply = {
  id: string;
  text: string;
  author: string;
  timestamp: string;
  likes: number;
  dislikes: number;
  userLiked?: boolean;
  userDisliked?: boolean;
};

const getCategories = (t: (key: string) => string) => [
  { value: 'general', label: t('community.general'), color: 'bg-primary/10 text-primary border-primary/20' },
  { value: 'support', label: t('community.support'), color: 'bg-accent/10 text-accent border-accent/20' },
  { value: 'advice', label: t('community.advice'), color: 'bg-earth/10 text-earth border-earth/20' },
  { value: 'celebration', label: t('community.celebration'), color: 'bg-primary-glow/10 text-primary-glow border-primary-glow/20' }
];

const farmerNames = ['രാമൻ', 'സുധാ', 'കൃഷ്ണൻ', 'ലക്ഷ്മി', 'രവി', 'പ്രിയ', 'മുരളി', 'കമല'];

export default function Community() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [text, setText] = useState('');
  const [category, setCategory] = useState<Post['category']>('general');
  const [currentUser] = useState(farmerNames[Math.floor(Math.random() * farmerNames.length)]);
  const [replyTexts, setReplyTexts] = useState<{[key: string]: string}>({});
  const [showReplyBox, setShowReplyBox] = useState<{[key: string]: boolean}>({});
  const { t } = useLanguage();
  const { user } = useAuth();

  useEffect(() => {
    const samplePosts: Post[] = [
      {
        id: '1',
        text: "വെള്ളരി കൃഷിയിൽ പുതിയതാണ്. ആദ്യത്തെ വിളവെടുപ്പിൽ വല്യ പ്രതീക്ഷയില്ല. എന്തെങ്കിലും നിർദ്ദേശങ്ങൾ ഉണ്ടോ?",
        likes: 7,
        author: 'രാമൻ',
        timestamp: '2 hours ago',
        category: 'support',
        replies: [
          {
            id: 'r1',
            text: 'ആദ്യമായി ചെയ്യുന്നവർക്ക് സാധാരണ നഷ്ടമുണ്ടാകും. മണ്ണിന്റെ PH value പരിശോധിച്ചോ? വെള്ളരിക്ക് 6.0-6.8 വേണം.',
            author: 'സുധാ',
            timestamp: '1 hour ago',
            likes: 3,
            dislikes: 0,
            userLiked: false,
            userDisliked: false
          }
        ]
      },
      {
        id: '2',
        text: "ഇന്നലെ എന്റെ തക്കാളി തോട്ടത്തിൽ നിന്ന് 15 കിലോ വിളവെടുത്തു! 🍅 മൂന്ന് മാസം കഠിനാധ്വാനത്തിന്റെ ഫലം കാണുമ്പോൾ അത്യന്തം സന്തോഷം!",
        likes: 12,
        author: 'കൃഷ്ണൻ',
        timestamp: '4 hours ago',
        category: 'celebration',
        replies: []
      }
    ];
    setPosts(samplePosts);
  }, []);

  const addPost = () => {
    if (!text.trim()) return;
    
    const p: Post = { 
      id: crypto.randomUUID(), 
      text: text.trim(), 
      likes: 0,
      author: user?.name || currentUser,
      timestamp: 'just now',
      category,
      replies: []
    };
    setPosts([p, ...posts]);
    setText('');
  };

  const like = (id: string) => {
    setPosts(posts.map(p => p.id === id ? {...p, likes: p.likes + 1} : p));
  };

  const addReply = (postId: string) => {
    const replyText = replyTexts[postId]?.trim();
    if (!replyText) return;

    const reply: Reply = {
      id: crypto.randomUUID(),
      text: replyText,
      author: user?.name || currentUser,
      timestamp: 'just now',
      likes: 0,
      dislikes: 0,
      userLiked: false,
      userDisliked: false
    };

    setPosts(posts.map(p => 
      p.id === postId 
        ? {...p, replies: [...p.replies, reply]}
        : p
    ));
    
    setReplyTexts({...replyTexts, [postId]: ''});
    setShowReplyBox({...showReplyBox, [postId]: false});
  };

  const deletePost = (id: string) => {
    setPosts(posts.filter(p => p.id !== id));
  };

  const likeReply = (postId: string, replyId: string) => {
    setPosts(posts.map(post => 
      post.id === postId 
        ? {
            ...post,
            replies: post.replies.map(reply => 
              reply.id === replyId 
                ? {
                    ...reply,
                    likes: reply.userLiked ? reply.likes - 1 : reply.likes + 1,
                    dislikes: reply.userDisliked ? reply.dislikes - 1 : reply.dislikes,
                    userLiked: !reply.userLiked,
                    userDisliked: false
                  }
                : reply
            )
          }
        : post
    ));
  };

  const dislikeReply = (postId: string, replyId: string) => {
    setPosts(posts.map(post => 
      post.id === postId 
        ? {
            ...post,
            replies: post.replies.map(reply => 
              reply.id === replyId 
                ? {
                    ...reply,
                    dislikes: reply.userDisliked ? reply.dislikes - 1 : reply.dislikes + 1,
                    likes: reply.userLiked ? reply.likes - 1 : reply.likes,
                    userDisliked: !reply.userDisliked,
                    userLiked: false
                  }
                : reply
            )
          }
        : post
    ));
  };

  const getCategoryInfo = (cat: Post['category']) => {
    const categories = getCategories(t);
    return categories.find(c => c.value === cat) || categories[0];
  };

  return (
    <div className="min-h-screen bg-gradient-subtle">
      {/* Header with Kerala farming theme */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-primary shadow-elegant"
      >
        <div className="max-w-4xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl shadow-glow">
                <Leaf className="w-8 h-8 text-primary-foreground" />
              </div>
              <div className="text-primary-foreground">
                <h1 className="text-3xl font-bold">{t('community.title')}</h1>
                <p className="text-primary-foreground/80 text-lg">{t('community.subtitle')}</p>
              </div>
            </div>
            <div className="text-right text-primary-foreground">
              <div className="flex items-center space-x-2 mb-1">
                <Users className="w-4 h-4" />
                <span className="font-semibold">{t('community.welcome')}, {user?.name || currentUser}!</span>
              </div>
              <p className="text-primary-foreground/70 text-sm">{posts.length} {t('community.discussions')}</p>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="max-w-4xl mx-auto px-6 py-8 space-y-8">
        {/* Create Post Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-card rounded-2xl shadow-card border border-border overflow-hidden"
        >
          <div className="bg-gradient-primary px-6 py-4">
            <h2 className="text-xl font-bold text-primary-foreground flex items-center space-x-2">
              <Sprout className="w-5 h-5" />
              <span>{t('community.share')}</span>
            </h2>
            <p className="text-primary-foreground/80 text-sm">{t('community.shareSubtitle')}</p>
          </div>
          
          <div className="p-6">
            {/* Category Selection */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-foreground mb-3">{t('community.category')}</label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {getCategories(t).map(cat => (
                  <button
                    key={cat.value}
                    onClick={() => setCategory(cat.value as Post['category'])}
                    className={`px-4 py-3 rounded-xl text-sm font-medium transition-smooth border-2 ${
                      category === cat.value 
                        ? cat.color + ' ring-2 ring-primary/30 transform scale-105'
                        : 'bg-muted text-muted-foreground hover:bg-muted/80 border-border'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>

            <textarea 
              className="w-full border-2 border-border rounded-xl p-4 focus:ring-4 focus:ring-primary/10 focus:border-primary resize-none text-foreground placeholder-muted-foreground bg-background"
              rows={4}
              value={text} 
              onChange={e => setText(e.target.value)} 
              placeholder={t('community.placeholder')}
            />
            
            <div className="mt-6 flex justify-between items-center">
              <p className="text-sm text-muted-foreground flex items-center space-x-1">
                <span>{text.length}/500 {t('community.characters')}</span>
                {text.length > 0 && <Leaf className="w-3 h-3 text-primary" />}
              </p>
              <button 
                onClick={addPost}
                disabled={!text.trim()}
                className="flex items-center space-x-2 px-8 py-3 bg-gradient-primary text-primary-foreground rounded-xl font-semibold hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-smooth transform hover:scale-105 shadow-soft"
              >
                <Send className="w-5 h-5" />
                <span>{t('community.shareButton')}</span>
              </button>
            </div>
          </div>
        </motion.div>

        {/* Posts */}
        <div className="space-y-6">
          {posts.map((post, index) => {
            const categoryInfo = getCategoryInfo(post.category);
            
            return (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-gradient-card rounded-2xl shadow-card border border-border overflow-hidden hover:shadow-elegant transition-smooth"
              >
                <div className="p-6">
                  {/* Post Header */}
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center text-primary-foreground font-bold text-lg shadow-soft">
                        {post.author[0]}
                      </div>
                      <div>
                        <p className="font-bold text-foreground text-lg">{post.author}</p>
                        <div className="flex items-center space-x-3">
                          <Clock className="w-4 h-4 text-muted-foreground" />
                          <p className="text-sm text-muted-foreground">{post.timestamp}</p>
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${categoryInfo.color}`}>
                            {categoryInfo.label}
                          </span>
                        </div>
                      </div>
                    </div>
                    {post.author === (user?.name || currentUser) && (
                      <button
                        onClick={() => deletePost(post.id)}
                        title="Delete post"
                        className="text-muted-foreground hover:text-destructive transition-colors p-2 rounded-full hover:bg-destructive/10"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    )}
                  </div>

                  {/* Post Content */}
                  <p className="text-foreground mb-6 leading-relaxed text-lg">{post.text}</p>

                  {/* Action Buttons */}
                  <div className="flex items-center space-x-8 pt-4 border-t-2 border-border/50">
                    <button 
                      onClick={() => like(post.id)}
                      className="flex items-center space-x-2 text-muted-foreground hover:text-destructive transition-colors p-2 rounded-full hover:bg-destructive/10"
                    >
                      <Heart className="w-5 h-5" />
                      <span className="font-semibold">{post.likes}</span>
                    </button>
                    
                    <button 
                      onClick={() => setShowReplyBox({...showReplyBox, [post.id]: !showReplyBox[post.id]})}
                      className="flex items-center space-x-2 text-muted-foreground hover:text-primary transition-colors p-2 rounded-full hover:bg-primary/10"
                    >
                      <MessageCircle className="w-5 h-5" />
                      <span className="font-semibold">
                        {post.replies.length > 0 ? `${post.replies.length} ${t('community.replies')}` : t('community.reply')}
                      </span>
                    </button>
                  </div>

                  {/* Replies */}
                  {post.replies.length > 0 && (
                    <div className="mt-8 space-y-4">
                      {post.replies.map(reply => (
                        <div key={reply.id} className="bg-muted/50 rounded-xl p-5 ml-12 border border-border">
                          <div className="flex items-start space-x-4">
                            <div className="w-10 h-10 bg-gradient-primary rounded-full flex items-center justify-center text-primary-foreground font-bold">
                              {reply.author[0]}
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center space-x-3 mb-2">
                                <p className="font-bold text-foreground">{reply.author}</p>
                                <p className="text-xs text-muted-foreground">{reply.timestamp}</p>
                              </div>
                              <p className="text-foreground leading-relaxed mb-3">{reply.text}</p>
                              
                              {/* Like/Dislike buttons for replies */}
                              <div className="flex items-center space-x-4">
                                <button 
                                  onClick={() => likeReply(post.id, reply.id)}
                                  className={`flex items-center space-x-1 text-sm transition-colors p-1 rounded-md ${
                                    reply.userLiked 
                                      ? 'text-green-600 bg-green-50' 
                                      : 'text-muted-foreground hover:text-green-600 hover:bg-green-50'
                                  }`}
                                >
                                  <ThumbsUp className="w-4 h-4" />
                                  <span>{reply.likes}</span>
                                </button>
                                
                                <button 
                                  onClick={() => dislikeReply(post.id, reply.id)}
                                  className={`flex items-center space-x-1 text-sm transition-colors p-1 rounded-md ${
                                    reply.userDisliked 
                                      ? 'text-red-600 bg-red-50' 
                                      : 'text-muted-foreground hover:text-red-600 hover:bg-red-50'
                                  }`}
                                >
                                  <ThumbsDown className="w-4 h-4" />
                                  <span>{reply.dislikes}</span>
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Reply Input */}
                  {showReplyBox[post.id] && (
                    <div className="mt-6 ml-12">
                      <div className="flex space-x-4">
                        <div className="w-10 h-10 bg-gradient-primary rounded-full flex items-center justify-center text-primary-foreground font-bold">
                          {(user?.name || currentUser)[0]}
                        </div>
                        <div className="flex-1">
                          <textarea
                            className="w-full border-2 border-border rounded-xl p-4 text-sm focus:ring-4 focus:ring-primary/10 focus:border-primary resize-none placeholder-muted-foreground bg-background text-foreground"
                            rows={3}
                            placeholder={t('community.replyPlaceholder')}
                            value={replyTexts[post.id] || ''}
                            onChange={e => setReplyTexts({...replyTexts, [post.id]: e.target.value})}
                          />
                          <div className="mt-3 flex justify-end space-x-3">
                            <button
                              onClick={() => setShowReplyBox({...showReplyBox, [post.id]: false})}
                              className="px-4 py-2 text-sm text-muted-foreground hover:text-foreground rounded-lg hover:bg-muted"
                            >
                              {t('community.cancel')}
                            </button>
                            <button
                              onClick={() => addReply(post.id)}
                              disabled={!replyTexts[post.id]?.trim()}
                              className="px-6 py-2 bg-gradient-primary text-primary-foreground rounded-lg font-semibold hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-smooth transform hover:scale-105"
                            >
                              {t('community.reply')}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>

        {posts.length === 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-16 bg-gradient-card rounded-2xl shadow-card border border-border"
          >
            <div className="p-6 bg-primary/10 rounded-full w-24 h-24 mx-auto mb-6 flex items-center justify-center">
              <Sprout className="w-12 h-12 text-primary" />
            </div>
            <h3 className="text-2xl font-bold text-foreground mb-3">{t('community.startConversation')}</h3>
            <p className="text-muted-foreground text-lg">{t('community.firstShare')}</p>
          </motion.div>
        )}
      </div>
    </div>
  );
}