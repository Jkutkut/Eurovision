r = """1 Norway 78
2 Belgium 73
3 Finland 59
4 Spain 39
5 Sweden 28
6 Ukraine 28
7 Serbia 27
8 Israel 26
9 France 23
10 Austria 20
11 Armenia 20
12 Czechia 18
13 Poland 12
14 Portugal 8
15 Switzerland 8
16 Cyprus 8
17 Australia 7
18 Germany 7
19 Lithuania 4
20 Moldova 3
21 Croatia 3
22 Estonia 2
23 Albania 1
24 Slovenia 1"""




r = r.split("\n")
r.reverse()

for result in r:
    input("\n\nnext?")
    print(result)

