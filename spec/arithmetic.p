program TEST;
type
   number=integer;
var
   i : number;
   j : number;
   r : real;
begin
   i := 17;
   j := 18*i - 100000;
   i := -j*i;
   j := j+i+3*(i-j);
   writeln(i);   
   writeln(j);
   r := 15.0;
   if r > 14.9 then
      writeln(100)
   else
      writeln(0);
   r := 1/2;
   if (r > 0.4) and (r < 0.6) then writeln(171717);
   r := 1 div 2;
   if r = 0 then writeln(1818);
   r := 5;
   r := r / 2;
   if r = 2.5 then writeln(1234);
   
   i := trunc(531.0 / 28.0);   
   writeln(i);
   
   i := round(3.0 / 2.0);
   writeln(i);

   i := round(60.0 / 7.0);
   writeln(i);

   i := round(40.0 / 9.0);
   writeln(i);

   if 5 >= 3 then writeln('5 >= 3');
   if 5 <= 3 then writeln('5 <= 3');
   if 5 < 3 then writeln('5 < 3');
   if 5 > 3 then writeln('5 > 3');   
   if 5 <> 3 then writeln('5 <> 3');      
   if 3 >= 3 then writeln('3 >= 3');
   if 3 <= 3 then writeln('3 <= 3');
   if 3 < 3 then writeln('3 < 3');
   if 3 > 3 then writeln('3 > 3');   
   if 3 <> 3 then writeln('3 <> 3');      

   if not 5 >= 3 then writeln('not 5 >= 3');
   if not 5 <= 3 then writeln('not 5 <= 3');
   if not 5 < 3 then writeln('not 5 < 3');
   if not 5 > 3 then writeln('not 5 > 3');   
   if not 5 <> 3 then writeln('not 5 <> 3');      
   if not 3 >= 3 then writeln('not 3 >= 3');
   if not 3 <= 3 then writeln('not 3 <= 3');
   if not 3 < 3 then writeln('not 3 < 3');
   if not 3 > 3 then writeln('not 3 > 3');   
   if not 3 <> 3 then writeln('not 3 <> 3');

   if 17 mod 8<>0 then writeln('17 mod 8<>0');

end.
