import random
import math

class poke:
    def __init__(self) :
        self.init()
        self.start()
    def init(self):

        self.cards = ['2','3','4','5','6','7','8','9','十','J','Q','K','A']
        self.cards = self.cards * 4
        self.cards.append('小王')
        self.cards.append('大王')
        self.playera,self.playerb,self.playerc = [],[],[]
        self.order = {
            'a':'b',
            'b':'c',
            'c':'a'
        }
        self.init_card_value()
    def start(self): #开始 给 abc发牌
        # print(self.cards)
        for i in range(17):

            index = math.floor(random.uniform(0,len(self.cards) - 1 ))
            self.playera.append(self.cards[index])
            self.out_card(self.cards,index)
            index = math.floor(random.uniform(0,len(self.cards) - 1 ))

            self.playerb.append(self.cards[index])
            self.out_card(self.cards, index)
            index = math.floor(random.uniform(0,len(self.cards) - 1 ))

            self.playerc.append(self.cards[index])
            self.out_card(self.cards, index)
        print('地主牌 :' + ' '.join(self.cards))

        self.playera.extend(self.cards)   #默认a是地主 剩下的就是地主牌
        self.neaten_card()
        self.play()
    def out_card(self,obj,index): #通过下标删牌
        obj.pop(index)
    def remove_card(self,obj,val):  #通过值删牌
        obj.remove(val)
    def neaten_card(self): #整理卡牌 方便观察
        self.playera.sort()
        self.playerb.sort()
        self.playerc.sort()

    def play(self):
        self.cur = 'a' #a先出牌
        self.hit_card = [] #最近打出的几张牌
        self.biggest = 'a'  #打出最大牌的人
        self.hit_mode = ''
        while len(self.playera) and len(self.playerb) and len(self.playerc):
            flag = False #监听出牌是否成功
            cur_list = []   #当前出牌者的手牌
            bigger = False
            if (self.cur == 'a'):
                cur_list = self.playera
            elif (self.cur == 'b'):
                cur_list = self.playerb
            else:
                cur_list = self.playerc
            #while flag
            while not flag:     #只要flag一直是false 就说明出牌失败
                try:

                    print('当前出牌人是' + self.cur)
                    if self.cur != self.biggest:
                        print(self.biggest +'打出了' + ' '.join(self.hit_card))
                    else:
                        print('上回合您最大')
                    print('手牌' + ' '.join(cur_list))
                    print('   0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7  第二个0开始代表10 输入牌的下标 以空格为间隔 下标仅供参考')
                    if len(self.hit_card) and self.cur != self.biggest:
                        print('输入 pass 表示要不起')
                    to_input = input()
                    to_input = to_input.strip()
                    if to_input == '':
                        continue
                    if(to_input == 'pass'):
                        if self.biggest == self.cur:  # 经过一回合 没有人比他大
                        # 必须得出牌了 但是任意顺序
                        # 必须出下标
                            bigger = True
                            print('你必须出牌')
                            continue
                        else:
                            self.cur = self.order[self.cur]
                            break
                        flag = True
                        continue
                    put_card = list(map(int,to_input.split()))
                    if self.biggest == self.cur:
                        bigger = True
                    #检查下标
                    if not self.check_cards(put_card,cur_list): #输入下标异常
                        print('输入下标不对哦')
                        continue
                    remove_list = list(map(lambda i : cur_list[i] ,put_card))   #处理成要删的列
                    #检查模式
                    #print('要打出列表 '  + ' '.join(remove_list))
                    cur_mode = self.judge_mode(remove_list,False) #要打出牌的模式
                    if cur_mode == 'fail' and self.cur == self.biggest:
                        print('出牌类型不对哦')
                        continue
                    pre_mode =  self.judge_mode(self.hit_card,True) #上个打出牌人的模式

                    if(  cur_mode == 'fail' or (cur_mode != pre_mode and len(self.hit_card))):
                        if cur_mode == 'King' or self.biggest == self.cur:
                            bigger = True
                        elif cur_mode == 'boom' and pre_mode != 'King':
                            bigger = True
                        else:
                            print('出牌模式不一致哦！')
                            continue
                    #判断是否比当前的大
                    if pre_mode == 'fail' or bigger :
                        #现在就是最大
                        bigger = True
                    else :
                        #计算大小
                        cur_val = self.total(remove_list,cur_mode)
                        pre_val = self.total(self.hit_card,pre_mode)
                        if cur_val <= pre_val:
                            print('你出的牌不够大哦')
                            continue
                    #删除
                    self.bulk_remove(cur_list,remove_list)

                    #更新最新数据 cur biggest
                    self.biggest = self.cur
                    self.cur = self.order[self.cur]
                    self.hit_card = remove_list
                    self.hit_mode = cur_mode
                    #print('出牌 ' + ' '.join(self.hit_card))
                    flag = True
                except:
                    print('输入出错')
                    continue


            # while flag

            #出牌成功后的处理



        #判断赢家
        if not len(self.playera) :
            print('地主 win')
        else:
            print('农民 win')
    def judge_mode(self,cards,is_pre):   #判断是哪种出牌模式
        str_cards = ''.join(cards)  #字符串好判断
        if str_cards == '小王大王' or cards == '大王小王':
            return 'King'
        if len(cards) == 1 :    #单牌
            return 'single'
        if len(cards) == 2 :    #双排
            if(cards[0] == cards[1]):
                return 'double'
            return 'fail'
        if len(cards) == 3 :    #三排
            if(cards[0] == cards[1] and cards[1] == cards[2]):
                return 'triple'
            return self.return_fail(3)

        if len(cards) == 4 :    #三带一或炸弹
            m = {}
            for i in str_cards:
                if i in m:
                    m[i] += 1
                else :
                    m[i] = 1
            if len(m.keys()) == 1:
                return 'boom'
            elif len(m.keys()) == 2:
                for i in m:
                    if m[i] != 2:
                        return '3->1'
            return self.return_fail(4)
        if len(cards) == 5 :    #三代二
            m = {}
            for i in str_cards:
                if i in m:
                    m[i] += 1
                else:
                    m[i] = 1

            if len(m.keys()) == 2:
                for i in m:
                    if m[i] == 2:
                        return '3->2'

        #暂时不支持飞机
        return 'fail'
    def return_fail(self,mes):
        print('你出的牌不合法' + str(mes))
        return 'fail'
    def check_cards(self,put_list,cur_list):    #检查输入的牌对不对
        m = {}
        for i in put_list:
            if i in m :
                return False
            else :
                m[i] = 1
            if i > len(cur_list) - 1:
                return False

        return True
    def bulk_remove(self,obj,remove_list):  #批量删除 或 单个删除
        for i in remove_list:
            self.remove_card(obj,i)
    def total(self,cards,mode):    #计算总值
        if(mode == 'King'):
            return 1000000
        val = 0
        m = {}
        big = ''
        big_char=""
        for i in cards:
            if i in m:
                m[i] += 1
                val += pow(self.card_value[i],m[i])
                val -= pow(self.card_value[i],m[i] - 1)
            else:
                m[i] = 1
                val += self.card_value[i]
        return val



    def init_card_value(self):
        self.card_value = {
            '3':3,
            '4':3.1,
            '5':3.2,
            '6':3.3,
            '7':3.4,
            '8':3.6,
            '9':3.7,
            '十':3.8,
            'J':3.9,
            'Q':4,
            'K':4.1,
            'A':4.2,
            '2':4.3,
            '小王':4.4,
            '大王':4.5
        }

if __name__ :
    p = poke()