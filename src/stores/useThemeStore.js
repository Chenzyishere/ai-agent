import {create} from 'zustand';
import { persist,createJSONStorage} from 'zustand/middleware';

export const useThemeStore = create(
    persist(
        (set,get) => ({
            theme:'light',//默认状态

            // 切换动作
            toggleTheme: () => {
                const newTheme = get().theme === 'light' ? 'dark' : 'light';
                set({theme:newTheme});

                // 手动同步到DOM，因为persist是异步写入存储
                // 这样能确保UI立即响应
                if(newTheme === 'dark'){
                    document.documentElement.classList.add('dark');
                } else {
                    document.documentElement.classList.remove('dark');
                }
            },

            // 初始化时同步DOM(防止刷新瞬间闪烁)
            // persist 中间件在rehydrate(从localStorage 读取)后会调用onRehydrateStorage
            onRehydrateStorage:()=>{
                return (state,error) => {
                    if(!error && state) {
                        if(state.theme === 'dark'){
                            document.documentElement.classList.add('dark');
                        } else {
                            document.documentElement.classList.remove('dark');
                        }
                    }
                }
            }
        }),
        {
            name:'theme-storage',
            storage:createJSONStorage(()=> localStorage),
            partialize: (state) => ({ theme: state.theme }), 
        }
    )
)