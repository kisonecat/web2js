program TEST;
    
var
   x : integer;
   y : integer;
   
procedure swap(var a, b: integer);
var
   temp: integer;
begin
   temp := a;
   a:= b;
   b := temp;
end;

procedure dontswap(a, b: integer);
var
   temp: integer;
begin
   temp := a;
   a:= b;
   b := temp;
end;

begin
   x := 17;
   y := -1000;
   writeln('Initially ',x,' and ',y);
   swap(x,y);
   writeln('But then! ',x,' and ',y);
   dontswap(x,y);
   writeln('And then! ',x,' and ',y);
   swap(x,y);
   writeln('Finally   ',x,' and ',y);   
end.
