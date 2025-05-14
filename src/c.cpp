#include<bits/stdc++.h>
using namespace std;
int main()
{
    vector<int> V = {1,2,3,4,5,6};
    int n = V[0],m=1;
    for(int i=1;i<V.size();i++)
    {
        m = m^(i+1);
        n = n ^ V[i];
    }
}