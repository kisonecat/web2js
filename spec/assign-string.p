program TEST;
const
   words  = 'Hello, World!';
   maxlen =  30;
   other  = 'Birds are the other.';
   
var
 phrase : array[1..maxlen] of char;

procedure print;
var i : integer;
begin
   for i := 1 to maxlen do
   write(phrase[i]);
   writeln();
end;

procedure print_numbers;
var i : integer;
begin
   for i := 1 to maxlen do
   write(ord(phrase[i]),', ');
   writeln();
end;

begin
   phrase := other;

   print;
   
   phrase := words;

   print;
   
   phrase := other;
   
   print;   

   print_numbers;
   
   print;

   phrase := words;

   print;

   print_numbers;

end.
